import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import theme from "./theme";
import "./components/styles/colorsTheme.css"
import "./components/styles/layouts.css"
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>
)
