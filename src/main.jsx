import { createRoot } from 'react-dom/client'
import { ChakraBaseProvider } from '@chakra-ui/react'
import App from './App'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <App />
  </BrowserRouter>

)
