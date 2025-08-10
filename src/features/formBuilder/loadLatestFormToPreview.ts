// loadLatestFormToPreview(state) {
//   const saved = JSON.parse(localStorage.getItem('forms') || '[]');
//   if (saved.length > 0) {
//     state.currentForm = saved[saved.length - 1]; // last form in list
//   } else {
//     state.currentForm = {
//       name: '',
//       createdAt: '',
//       fields: [],
//     };
//   }
// }