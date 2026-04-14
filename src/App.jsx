import { ChakraProvider, Button } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login"
import Dashboard from "./dashboard"
import ProjectsViewer from "./ProjectsViewer"
import React from "react";
export default function App() {

  const [projects, setProjects] = React.useState([
    {
      id: 1,
      info: { title: "Alpha", desc: "...", color: "#fff" },
      tasks: [
        { id: 1, title: "Tarea", desc: "...", status: "todo" }
      ]
    }
  ])

  const handleCreateTask = (projectId, newTask) => {
    setTasks(prev => [...prev, newTask])
  }
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsViewer />} />
      </Routes>

    </ChakraProvider>
  );
}
