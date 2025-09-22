import { useTabStore } from '@/store/tabStore';
import { Settings, Lock, Unlock } from 'lucide-react';

export const DevModeToggle = () => {
    const { showTabValidation, toggleTabValidation } = useTabStore();

    return (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg shadow-sm border border-blue-200">
                    <Settings className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">Modo de Navegação</h3>
                    <p className="text-xs text-gray-600">
                        {showTabValidation
                            ? 'Validação obrigatória entre as etapas'
                            : 'Navegação livre entre todas as etapas'
                        }
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-medium">
                        {showTabValidation ? 'Validação' : 'Teste'}
                    </span>
                    <button
                        onClick={toggleTabValidation}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm ${showTabValidation
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 shadow-sm ${showTabValidation ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        {showTabValidation ? (
                            <>
                                <Lock className="w-3 h-3 text-red-500" />
                                <span className="font-medium">Ativa</span>
                            </>
                        ) : (
                            <>
                                <Unlock className="w-3 h-3 text-green-500" />
                                <span className="font-medium">Livre</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
