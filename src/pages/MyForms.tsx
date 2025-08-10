// src/pages/MyForms.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Paper, List, ListItemButton, ListItemText, Divider } from "@mui/material";

const MyForms = () => {
  const [forms, setForms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("forms") || "[]");
    setForms(saved);
  }, []);

  if (forms.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">No saved forms found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Forms</Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {forms.map((form, index) => (
          <Paper key={index} sx={{ mb: 1 }}>
            <ListItemButton onClick={() => navigate(`/preview/${index}`)}>
              <ListItemText
                primary={form.name}
                secondary={`Created: ${new Date(form.createdAt).toLocaleString()}`}
              />
            </ListItemButton>
          </Paper>
        ))}
      </List>
    </Container>
  );
};

export default MyForms;
