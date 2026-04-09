import { ChakraProvider, Button } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login"
import Dashboard from "./dashboard"
export default function App() {

  return (
    <ChakraProvider>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </ChakraProvider>
  );
}
