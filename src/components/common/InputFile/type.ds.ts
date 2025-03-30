export interface InputFileProps {
  name: string;
  id?: string;
  accept?: string;
  disabled?: boolean;
  selectOptions?: {
    value: string;
    label: string;
    description?: string;
  }[];
  description?: string;
  label?: string;
  linkLabel?: string;
  openLink?: string;
  downloadLabel?: string;
  downloadLink?: string;
  required?: boolean;
}

export type DataProps = {
  file?: { value: File; mimeType: string };
  option?: { type: string; value: string };
};
