import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FormValidationState {
    // Documentos selecionados para revisão
    selectedDocuments: number[];
    documentIndices: Map<number, number>;

    // Seções expandidas nos documentos
    expandedSections: Set<string>;

    // Membros da família expandidos
    expandedFamilyMembers: Set<number>;

    // Tab ativa
    activeTab: string;

    // Status de validação de cada seção
    validationStatus: Record<string, string>;

    // Comentários de validação (se houver)
    validationComments: Record<string, string>;

    // Ações
    setSelectedDocuments: (documents: number[]) => void;
    toggleDocumentSelection: (documentId: number, displayIndex: number) => void;
    setDocumentIndices: (indices: Map<number, number>) => void;
    setExpandedSections: (sections: Set<string>) => void;
    toggleExpandedSection: (section: string) => void;
    setExpandedFamilyMembers: (members: Set<number>) => void;
    toggleExpandedFamilyMember: (index: number) => void;
    setActiveTab: (tab: string) => void;
    setValidationStatus: (validationStatus: Record<string, string>) => void;
    setValidationComments: (section: string, comment: string) => void;
    hasChanges: () => boolean;
    reset: () => void;
}

const initialState = {
    selectedDocuments: [] as number[],
    documentIndices: new Map<number, number>(),
    expandedSections: new Set<string>(),
    expandedFamilyMembers: new Set<number>(),
    activeTab: 'scholarship_info',
    validationStatus: {} as Record<string, string>,
    validationComments: {} as Record<string, string>,
};

export const useFormValidationStore = create<FormValidationState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setSelectedDocuments: (documents) => set({ selectedDocuments: documents }),

            toggleDocumentSelection: (documentId, displayIndex) => {
                const { selectedDocuments, documentIndices } = get();
                if (selectedDocuments.includes(documentId)) {
                    const newIndices = new Map(documentIndices);
                    newIndices.delete(documentId);
                    set({
                        selectedDocuments: selectedDocuments.filter(id => id !== documentId),
                        documentIndices: newIndices
                    });
                } else {
                    const newIndices = new Map(documentIndices);
                    newIndices.set(documentId, displayIndex);
                    set({
                        selectedDocuments: [...selectedDocuments, documentId],
                        documentIndices: newIndices
                    });
                }
            },

            setDocumentIndices: (indices) => set({ documentIndices: indices }),

            setExpandedSections: (sections) => set({ expandedSections: sections }),

            toggleExpandedSection: (section) => {
                const { expandedSections } = get();
                const newSet = new Set(expandedSections);
                if (newSet.has(section)) {
                    newSet.delete(section);
                } else {
                    newSet.add(section);
                }
                set({ expandedSections: newSet });
            },

            setExpandedFamilyMembers: (members) => set({ expandedFamilyMembers: members }),

            toggleExpandedFamilyMember: (index) => {
                const { expandedFamilyMembers } = get();
                const newSet = new Set(expandedFamilyMembers);
                if (newSet.has(index)) {
                    newSet.delete(index);
                } else {
                    newSet.add(index);
                }
                set({ expandedFamilyMembers: newSet });
            },

            setActiveTab: (tab) => set({ activeTab: tab }),

            setValidationStatus: (validationStatus) => {
                set({ validationStatus });
            },

            setValidationComments: (section, comment) => {
                const { validationComments } = get();
                set({ validationComments: { ...validationComments, [section]: comment } });
            },

            hasChanges: () => {
                const { selectedDocuments, validationStatus, validationComments } = get();
                return selectedDocuments.length > 0 ||
                       Object.keys(validationStatus).length > 0 ||
                       Object.keys(validationComments).length > 0;
            },

            reset: () => set(initialState),
        }),
        {
            name: 'form-validation-storage',
            storage: {
                getItem: (name) => {
                    try {
                        const str = localStorage.getItem(name);
                        if (!str) return null;
                        const parsed = JSON.parse(str);
                        return {
                            state: {
                                ...parsed.state,
                                documentIndices: new Map(parsed.state.documentIndices || []),
                                expandedSections: new Set(parsed.state.expandedSections || []),
                                expandedFamilyMembers: new Set(parsed.state.expandedFamilyMembers || []),
                                activeTab: parsed.state.activeTab || 'scholarship_info',
                            },
                            version: parsed.version,
                        };
                    } catch (e) {
                        console.error('Error loading from localStorage:', e);
                        return null;
                    }
                },
                setItem: (name, value) => {
                    try {
                        const serialized = {
                            state: {
                                ...value.state,
                                documentIndices: Array.from(value.state.documentIndices.entries()),
                                expandedSections: Array.from(value.state.expandedSections),
                                expandedFamilyMembers: Array.from(value.state.expandedFamilyMembers),
                                activeTab: value.state.activeTab || 'scholarship_info',
                            },
                            version: value.version,
                        };
                        localStorage.setItem(name, JSON.stringify(serialized));
                    } catch (e) {
                        console.error('Error saving to localStorage:', e);
                    }
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);

