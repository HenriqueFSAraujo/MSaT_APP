import type { CSSProperties } from 'react';
import { formatBytes, useFileDrop } from '../hooks/useFileDrop';
import type { UseFileDropOptions } from '../hooks/useFileDrop';

export interface FileDropzoneProps extends UseFileDropOptions {
  label?: string;
  className?: string;
}

export function FileDropzone({
  label = 'Arraste os documentos do Explorador de Arquivos para esta caixa',
  className,
  disabled = false,
  ...options
}: FileDropzoneProps) {
  const {
    files,
    errors,
    isDragging,
    dropHandlers,
    removeFile,
    allowedLabel,
    maxSizeMB,
  } = useFileDrop({ ...options, disabled });

  const zoneStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    boxSizing: 'border-box',
    width: '100%',
    minHeight: 120,
    padding: '20px 16px',
    border: `2px dashed ${isDragging ? '#2563eb' : '#9ca3af'}`,
    borderRadius: 8,
    background: isDragging ? '#eff6ff' : '#f9fafb',
    color: '#374151',
    textAlign: 'center',
    cursor: disabled ? 'not-allowed' : 'copy',
    opacity: disabled ? 0.6 : 1,
    transition: 'border-color 0.15s, background-color 0.15s',
  };

  return (
    <div className={className}>
      <div
        aria-label={label}
        aria-disabled={disabled}
        style={zoneStyle}
        {...dropHandlers}
      >
        <strong>{isDragging ? 'Solte os arquivos para anexar' : label}</strong>
        <small style={{ pointerEvents: 'none', color: '#6b7280' }}>
          Formatos: {allowedLabel} · Tamanho máximo: {maxSizeMB} MB por arquivo
        </small>
      </div>

      {errors.length > 0 && (
        <ul
          role="alert"
          style={{ margin: '8px 0 0', paddingLeft: 18, color: '#b91c1c', fontSize: 14 }}
        >
          {errors.map((err, i) => (
            <li key={`${err.fileName}-${err.reason}-${i}`}>{err.message}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                padding: '6px 10px',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                marginBottom: 4,
                fontSize: 14,
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name} <small style={{ color: '#6b7280' }}>({formatBytes(file.size)})</small>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                aria-label={`Remover ${file.name}`}
                disabled={disabled}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  padding: '4px 8px',
                  color: '#6b7280',
                  fontSize: 14,
                }}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileDropzone;
