
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use standard React 18 createRoot API which works in all environments
createRoot(document.getElementById("root")!).render(<App />);
