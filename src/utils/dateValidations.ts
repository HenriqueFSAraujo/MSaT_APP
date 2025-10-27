import { z } from 'zod';

export enum DateValidationRules {
  BIRTH_DATE_STRING = 'birth_date_string',

  BIRTH_DATE_OBJECT = 'birth_date_object',
}

export const birthDateStringValidation = z
  .string()
  .min(1, 'Data de nascimento é obrigatória')
  .refine(
    (date) => {
      if (!date || date.trim() === '') return false;

      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = date.match(dateRegex);
      if (!match) return false;

      const [, day, month, year] = match;
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (monthNum < 1 || monthNum > 12) return false;
      if (dayNum < 1 || dayNum > 31) return false;

      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear) return false;

      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      if (dayNum > daysInMonth) return false;

      const inputDate = new Date(yearNum, monthNum - 1, dayNum);
      const today = new Date();

      if (inputDate > today) return false;

      const ageInYears = today.getFullYear() - yearNum;
      if (ageInYears > 120) return false;

      return true;
    },
    {
      message: 'Data de nascimento inválida. Use o formato DD/MM/YYYY e verifique se a data é válida.',
    }
  );

export const birthDateObjectValidation = z
  .date()
  .refine(
    (date) => {
      const today = new Date();

      if (date > today) return false;

      const ageInYears = today.getFullYear() - date.getFullYear();
      if (ageInYears > 120) return false;

      if (date.getFullYear() < 1900) return false;

      return true;
    },
    {
      message: 'Data de nascimento inválida. Verifique se a data é válida e não é futura.',
    }
  );

export const optionalBirthDateStringValidation = z
  .string()
  .optional()
  .default('')
  .refine(
    (date) => {
      if (!date || date.trim() === '') return true;

      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = date.match(dateRegex);
      if (!match) return false;

      const [, day, month, year] = match;
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (monthNum < 1 || monthNum > 12) return false;
      if (dayNum < 1 || dayNum > 31) return false;

      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear) return false;

      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      if (dayNum > daysInMonth) return false;

      const inputDate = new Date(yearNum, monthNum - 1, dayNum);
      const today = new Date();

      if (inputDate > today) return false;

      const ageInYears = today.getFullYear() - yearNum;
      if (ageInYears > 120) return false;

      return true;
    },
    {
      message: 'Data de nascimento inválida. Use o formato DD/MM/YYYY e verifique se a data é válida.',
    }
  );

export const flexibleBirthDateStringValidation = z
  .string()
  .optional()
  .default('')
  .refine(
    (date) => {
      if (!date || date.trim() === '') return true;

      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = date.match(dateRegex);
      if (!match) return false;

      const [, day, month, year] = match;
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (monthNum < 1 || monthNum > 12) return false;
      if (dayNum < 1 || dayNum > 31) return false;

      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear + 1) return false;

      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      if (dayNum > daysInMonth) return false;

      const inputDate = new Date(yearNum, monthNum - 1, dayNum);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (inputDate > today) return false;

      const ageInYears = today.getFullYear() - yearNum;
      if (ageInYears > 120) return false;

      return true;
    },
    {
      message: 'Data de nascimento inválida. Use o formato DD/MM/YYYY e verifique se a data é válida.',
    }
  );

export const getDateValidation = (type: DateValidationRules) => {
  switch (type) {
    case DateValidationRules.BIRTH_DATE_STRING:
      return birthDateStringValidation;
    case DateValidationRules.BIRTH_DATE_OBJECT:
      return birthDateObjectValidation;
    default:
      return birthDateStringValidation;
  }
};
