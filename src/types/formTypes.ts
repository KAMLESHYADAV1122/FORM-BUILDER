// types/formTypes.ts

import formSlice from "../features/formBuilder/formSlice";

export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'derived';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean;
}

export interface DerivedConfig {
  parentFields: string[];  // Field IDs this derived field depends on
  formula: string;         // e.g., "field1 + field2"
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  options?: string[];                // For select, radio
  validation?: FieldValidation;
  derived?: DerivedConfig;          // Only for derived fields
}

export interface FormSchema {
  name: string;
  createdAt: string;
  fields: FormField[];
}

