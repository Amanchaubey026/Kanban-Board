// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@fontsource/poppins';
import {BrowserRouter} from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <Toaster>
  <DndProvider backend={HTML5Backend}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </DndProvider>
  // </Toaster>
)
