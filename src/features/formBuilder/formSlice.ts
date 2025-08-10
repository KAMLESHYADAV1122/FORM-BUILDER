import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { FormField, FormSchema } from '../../types/formTypes.ts';


interface FormBuilderState {
  currentForm: FormSchema;
  savedForms: FormSchema[];
  

}


const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    createdAt: '',
    fields: [],
  },
  savedForms: [],
};

const formSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormName(state, action: PayloadAction<string>) {
      state.currentForm.name = action.payload;
      state.currentForm.createdAt = new Date().toISOString();
    },
    addField(state, action: PayloadAction<FormField>) {
      state.currentForm.fields.push(action.payload);
    },
    updateField(state, action: PayloadAction<{ index: number; field: FormField }>) {
      state.currentForm.fields[action.payload.index] = action.payload.field;
    },
    deleteField(state, action: PayloadAction<number>) {
      state.currentForm.fields.splice(action.payload, 1);
    },
    saveForm(state) {
      const formToSave = { ...state.currentForm };
      const existing = JSON.parse(localStorage.getItem('forms') || '[]');
      const updated = [...existing, formToSave];
      localStorage.setItem('forms', JSON.stringify(updated));
      state.savedForms = updated;
    },
    loadSavedForms(state) {
      const saved = JSON.parse(localStorage.getItem('forms') || '[]');
      state.savedForms = saved;
    },
    loadFormToPreview(state, action: PayloadAction<FormSchema>) {
      state.currentForm = action.payload;
    },
  },
});

export const {
  setFormName,
  addField,
  updateField,
  deleteField,
  saveForm,
  loadSavedForms,
  loadFormToPreview,
  // loadLatestFormToPreview,
} = formSlice.actions;

export default formSlice.reducer;
