import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DragEvent } from 'react';

export const DEFAULT_ALLOWED_EXTENSIONS = ['.txt', '.doc', '.docx', '.pdf'] as const;
export const DEFAULT_MAX_SIZE_MB = 10; // limite médio para documentos escolares
export const DEFAULT_MAX_FILES = 5;

export type FileRejectionReason = 'type' | 'size' | 'empty' | 'duplicate' | 'limit';

export interface FileRejection {
  fileName: string;
  reason: FileRejectionReason;
  message: string;
}

export interface UseFileDropOptions {
  allowedExtensions?: readonly string[];
  maxSizeMB?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  onFilesChange?: (files: File[]) => void;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot <= 0 ? '' : fileName.slice(dot).toLowerCase();
}

function isSameFile(a: File, b: File): boolean {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

function dragHasFiles(e: DragEvent<HTMLElement>): boolean {
  return Array.from(e.dataTransfer?.types ?? []).includes('Files');
}

export function useFileDrop({
  allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  maxFiles = DEFAULT_MAX_FILES,
  multiple = true,
  disabled = false,
  onFilesChange,
}: UseFileDropOptions = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FileRejection[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Refs: não disparam re-render (importante porque dragover dispara dezenas de vezes por segundo)
  const filesRef = useRef<File[]>([]);
  const dragDepth = useRef(0);
  const onFilesChangeRef = useRef(onFilesChange);

  useEffect(() => {
    onFilesChangeRef.current = onFilesChange;
  }, [onFilesChange]);

  // Chave estável: evita recalcular tudo se a página passar um array inline
  const allowedKey = allowedExtensions
    .map((extension) => extension.trim().toLowerCase())
    .filter(Boolean)
    .join(',');
  const allowed = useMemo(
    () => allowedKey.split(',').filter(Boolean).map((extension) =>
      extension.startsWith('.') ? extension : `.${extension}`
    ),
    [allowedKey],
  );
  const allowedLabel = useMemo(
    () => allowed.map((ext) => ext.replace('.', '').toUpperCase()).join(', '),
    [allowed],
  );
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  useEffect(() => {
    if (disabled) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  }, [disabled]);

  const commit = useCallback((next: File[]) => {
    filesRef.current = next;
    setFiles(next);
    onFilesChangeRef.current?.(next);
  }, []);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return;

      // Copia ANTES de qualquer coisa: o FileList do input é esvaziado ao resetar o value
      const list = Array.from(incoming);
      if (list.length === 0) return;

      const base = multiple ? filesRef.current : [];
      const limit = multiple ? maxFiles : 1;
      const accepted: File[] = [];
      const rejections: FileRejection[] = [];

      for (const file of list) {
        const reject = (reason: FileRejectionReason, message: string) => {
          rejections.push({ fileName: file.name, reason, message });
        };

        if (!allowed.includes(getExtension(file.name))) {
          reject('type', `"${file.name}": tipo não permitido. Envie apenas ${allowedLabel}.`);
          continue;
        }
        if (file.size === 0) {
          reject('empty', `"${file.name}": o arquivo está vazio.`);
          continue;
        }
        if (file.size > maxSizeBytes) {
          reject(
            'size',
            `"${file.name}" (${formatBytes(file.size)}) excede o limite de ${maxSizeMB} MB.`,
          );
          continue;
        }
        if ([...base, ...accepted].some((f) => isSameFile(f, file))) {
          reject('duplicate', `"${file.name}": este arquivo já foi anexado.`);
          continue;
        }
        if (base.length + accepted.length >= limit) {
          reject(
            'limit',
            multiple
              ? `"${file.name}": limite de ${maxFiles} arquivos atingido.`
              : `"${file.name}": apenas um arquivo é permitido.`,
          );
          continue;
        }
        accepted.push(file);
      }

      setErrors(rejections);
      if (accepted.length > 0) commit([...base, ...accepted]);
    },
    [disabled, multiple, maxFiles, allowed, allowedLabel, maxSizeBytes, maxSizeMB, commit],
  );

  const removeFile = useCallback(
    (index: number) => {
      commit(filesRef.current.filter((_, i) => i !== index));
      setErrors([]);
    },
    [commit],
  );

  const clearFiles = useCallback(() => {
    commit([]);
    setErrors([]);
  }, [commit]);

  const clearErrors = useCallback(() => setErrors([]), []);

  // ---- Eventos de arrastar ----
  // dragenter/dragleave disparam também ao passar por elementos filhos (causa flicker).
  // O contador resolve isso e só atualiza o estado quando o valor realmente muda.
  const onDragEnter = useCallback(
    (e: DragEvent<HTMLElement>) => {
      if (!dragHasFiles(e)) return;
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragDepth.current += 1;
      if (dragDepth.current === 1) setIsDragging(true);
    },
    [disabled],
  );

  // dragover dispara continuamente: aqui NÃO há setState, então não há re-render.
  const onDragOver = useCallback(
    (e: DragEvent<HTMLElement>) => {
      if (!dragHasFiles(e)) return;
      e.preventDefault(); // obrigatório para o navegador permitir o drop
      e.stopPropagation();
      e.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
    },
    [disabled],
  );

  const onDragLeave = useCallback(
    (e: DragEvent<HTMLElement>) => {
      if (!dragHasFiles(e)) return;
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setIsDragging(false);
    },
    [disabled],
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      if (!dragHasFiles(e)) return;
      e.preventDefault();
      e.stopPropagation();
      dragDepth.current = 0;
      setIsDragging(false);
      if (disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [disabled, addFiles],
  );

  const dropHandlers = useMemo(
    () => ({ onDragEnter, onDragOver, onDragLeave, onDrop }),
    [onDragEnter, onDragOver, onDragLeave, onDrop],
  );

  return {
    files,
    errors,
    isDragging,
    dropHandlers,
    addFiles,
    removeFile,
    clearFiles,
    clearErrors,
    allowedLabel,
    maxSizeMB,
  };
}