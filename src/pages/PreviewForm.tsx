// src/pages/PreviewForm.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Divider,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  MenuItem,
  Button
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loadFormToPreview } from "../features/formBuilder/formSlice";
import type { FormSchema } from "../types/formTypes";

const PreviewForm: React.FC = () => {
  // id may be undefined; typed to string | undefined
  const { id } = useParams<{ id?: string }>();
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.formBuilder.currentForm) as FormSchema;
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // load saved forms safely
    let saved: FormSchema[] = [];
    try {
      const raw = localStorage.getItem("forms");
      saved = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(saved)) saved = [];
    } catch (e) {
      console.error("Could not parse forms from localStorage:", e);
      saved = [];
    }

    // pick target form
    let targetForm: FormSchema | undefined;

    if (id !== undefined) {
      // 1) try to treat id as numeric index
      const index = Number(id);
      if (!Number.isNaN(index) && index >= 0 && index < saved.length) {
        targetForm = saved[index];
      } else {
        // 2) try to match by form.id or form.name (in case you saved a UUID or name)
        targetForm = saved.find((f) => (f as any).id === id || f.name === id);
      }
    } else {
      // no id param: use the latest saved form
      if (saved.length > 0) targetForm = saved[saved.length - 1];
    }

    if (targetForm) {
      dispatch(loadFormToPreview(targetForm));
      // initialise values from defaultValue if present
      const initialValues: Record<string, any> = {};
      (targetForm.fields || []).forEach((fld) => {
        initialValues[fld.id] = fld.defaultValue ?? (fld.type === "checkbox" ? false : "");
      });
      setValues(initialValues);
    } else {
      // nothing found — optionally clear current form in redux or leave as-is
      console.warn("No target form found for preview. id:", id, "saved length:", saved.length);
    }
  }, [dispatch, id]);

  // basic validators (expand as needed)
  const validateField = (field: any, value: any) => {
    const rules = field.validation || {};
    if (rules.required && (value === "" || value === undefined || value === null)) {
      return `${field.label} is required`;
    }
    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
      return `${field.label} must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
      return `${field.label} must be at most ${rules.maxLength} characters`;
    }
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return `Invalid email format`;
    }
    if (rules.passwordRule && value && !/^(?=.*\d).{8,}$/.test(value)) {
      return `Password must be >=8 chars and include a number`;
    }
    return "";
  };

  const handleChange = (fieldId: string, rawValue: any) => {
    setValues((prev) => {
      const next = { ...prev, [fieldId]: rawValue };

      // auto-update derived fields if present
      if (form?.fields?.length) {
        form.fields
          .filter((f) => f.type === "derived" && f.derived)
          .forEach((derivedField) => {
            const { parentFields, formula } = derivedField.derived!;
            let expr = formula;
            parentFields.forEach((pid) => {
              // replace parent id tokens with their current values (fallback 0)
              const parentVal = next[pid] ?? 0;
              // be careful: replace all occurrences of pid (simple approach)
              expr = expr.split(pid).join(String(parentVal));
            });
            try {
              // simple eval for math (safe only for controlled inputs); consider a parser later
              // eslint-disable-next-line no-eval
              next[derivedField.id] = eval(expr);
            } catch {
              next[derivedField.id] = "";
            }
          });
      }

      return next;
    });

    // clear error for the field on change
    setErrors((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const handleBlur = (field: any) => {
    const err = validateField(field, values[field.id]);
    setErrors((prev) => ({ ...prev, [field.id]: err }));
  };

  if (!form || !form.name || form.fields.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">No form exists to preview</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {form.name}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Created: {form.createdAt ? new Date(form.createdAt).toLocaleString() : "—"}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {form.fields.map((field) => (
        <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
          {["text", "number", "date", "textarea"].includes(field.type) && (
            <TextField
              label={field.label}
              fullWidth
              multiline={field.type === "textarea"}
              type={field.type === "textarea" ? "text" : field.type}
              value={values[field.id] ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={() => handleBlur(field)}
              error={!!errors[field.id]}
              helperText={errors[field.id] ?? ""}
            />
          )}

          {field.type === "select" && (
            <TextField
              select
              label={field.label}
              fullWidth
              value={values[field.id] ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={() => handleBlur(field)}
              error={!!errors[field.id]}
              helperText={errors[field.id] ?? ""}
            >
              {field.options?.map((opt: string) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          )}

          {field.type === "radio" && (
            <RadioGroup
              value={values[field.id] ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={() => handleBlur(field)}
            >
              {field.options?.map((opt: string) => (
                <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
              ))}
            </RadioGroup>
          )}

          {field.type === "checkbox" && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!values[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                />
              }
              label={field.label}
            />
          )}

          {field.type === "derived" && (
            <TextField label={field.label} fullWidth value={values[field.id] ?? ""} disabled />
          )}
        </Paper>
      ))}

      <Button
        variant="contained"
        onClick={() => {
          // run validation for all fields
          const newErrors: Record<string, string> = {};
          form.fields.forEach((f) => {
            const err = validateField(f, values[f.id]);
            if (err) newErrors[f.id] = err;
          });
          setErrors(newErrors);
          if (Object.keys(newErrors).length === 0) {
            // submit action (for this assignment we just alert / log)
            alert("Form submitted successfully!");
            console.log("Submitted values:", values);
          }
        }}
      >
        Submit
      </Button>
    </Container>
  );
};

export default PreviewForm;
