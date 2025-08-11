// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import CreateForm from './pages/CreateForm';  // ✅ Correct spelling
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';

const App = () => {
  return (
   <Routes>
  <Route path="/create" element={<CreateForm />} />
  <Route path="/preview" element={<PreviewForm />} />
  <Route path="/myforms" element={<MyForms />} />
</Routes>

  );
};

export default App;
