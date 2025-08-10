// src/pages/CreateForm.tsx

import { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack,
  Paper,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  addField,
  deleteField,
  saveForm,
  setFormName,
} from '../features/formBuilder/formSlice';
import type { FieldType, FormField } from '../types/formTypes'; // ✅ type-only import


const fieldTypes: FieldType[] = [
  'text',
  'number',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'date',
];

const CreateForm = () => {
  const dispatch = useAppDispatch();

  // ✅ FIX this selector — previously `useAppSelector((state) => c);`
const form = useAppSelector((state) => state.formBuilder.currentForm);

  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [required, setRequired] = useState(false);

  const handleAddField = () => {
    if (!label.trim()) return;

    const newField: FormField = {
      id: uuidv4(),
      label,
      type,
      validation: { required },
    };

    dispatch(addField(newField));
    setLabel('');
    setType('text');
    setRequired(false);
  };

  const handleDeleteField = (index: number) => {
    dispatch(deleteField(index));
  };

  const handleSaveForm = () => {
    const name = prompt('Enter form name');
    if (name) {
      dispatch(setFormName(name));
      dispatch(saveForm());
      alert('Form saved!');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Form
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Stack spacing={2}>
          <TextField
            label="Field Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <TextField
            select
            label="Field Type"
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
          >
            {fieldTypes.map((ft) => (
              <MenuItem key={ft} value={ft}>
                {ft}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
              />
            }
            label="Required"
          />
          <Button variant="contained" onClick={handleAddField}>
            Add Field
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h6">Current Fields</Typography>
      <Stack spacing={2}>
        {form.fields.map((field, idx) => (
          <Paper
            key={field.id}
            sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}
          >
            <div>
              <Typography>
                <strong>Label:</strong> {field.label}
              </Typography>
              <Typography>
                <strong>Type:</strong> {field.type}
              </Typography>
              <Typography>
                <strong>Required:</strong>{' '}
                {field.validation?.required ? 'Yes' : 'No'}
              </Typography>
            </div>
            <Button
              color="error"
              variant="outlined"
              onClick={() => handleDeleteField(idx)}
            >
              Delete
            </Button>
          </Paper>
        ))}
      </Stack>

      <Button
        sx={{ mt: 4 }}
        variant="contained"
        color="success"
        onClick={handleSaveForm}
      >
        Save Form
      </Button>
    </Container>
  );
};

export default CreateForm;
