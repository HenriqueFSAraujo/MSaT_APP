// Mapeamentos para converter valores da API em labels legíveis
export const valueMappings: Record<string, Record<string, string>> = {
    gender: {
        'masculino': 'Masculino',
        'feminino': 'Feminino',
        'outro': 'Outro'
    },
    deficiency: {
        's': 'Sim',
        'n': 'Não',
        'y': 'Sim',
        'sim': 'Sim',
        'nao': 'Não',
        'yes': 'Sim',
        'no': 'Não'
    },
    maritalStatus: {
        'c': 'Casado',
        's': 'Solteiro',
        'd': 'Divorciado',
        'v': 'Viúvo',
        'o': 'Outro'
    },
    sewage: {
        's': 'Sim',
        'n': 'Não'
    },
    electricity: {
        'rede_publica': 'Rede pública',
        'gerador': 'Gerador',
        'outros': 'Outros'
    },
    water: {
        'rede_publica': 'Rede pública',
        'poco': 'Poço',
        'outros': 'Outros'
    },
    transport: {
        'onibus': 'Ônibus',
        'particular': 'Carro particular',
        'moto': 'Moto',
        'outros': 'Outros'
    },
    activities: {
        's': 'Sim',
        'n': 'Não',
        'sim': 'Sim',
        'nao': 'Não'
    }
};

// Função para extrair e mapear valores
export const extractDisplayValue = (value: unknown, fieldType?: string): string => {
    if (value === null || value === undefined) return '';

    let stringValue = '';

    // Se é um primitivo, converter para string
    if (typeof value !== 'object') {
        stringValue = String(value).trim();
    }
    // Se é um array, retornar como string vazio (arrays devem ser tratados separadamente)
    else if (Array.isArray(value)) {
        return '';
    }
    // Se é um objeto, extrair o valor
    else {
        const entries = Object.entries(value);
        const values = entries.map(([, val]) => val).filter(v => typeof v === 'string' && v.trim().length > 0);

        if (values.length > 0) {
            stringValue = String(values[0]).trim();
        } else {
            return '';
        }
    }

    // Aplicar mapeamento se existir
    if (fieldType && valueMappings[fieldType]) {
        const lowerValue = stringValue.toLowerCase();
        const mappedValue = valueMappings[fieldType][lowerValue];
        if (mappedValue) {
            return mappedValue;
        }
    }

    return stringValue;
};

