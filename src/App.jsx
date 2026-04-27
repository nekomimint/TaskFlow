import { ChakraProvider, Button } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login"
import Dashboard from "./dashboard"
import ProjectsViewer from "./ProjectsViewer"
import React from "react";
import { useState } from "react";
export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const dataUser = ([
    {
      id: 1,
      userName: "New User",
      profilePhoto: null, // This can be null is user not upload photo and will passed as base64
      password: "DefaultPassword",
      projects: [ //* Todos los proyectos de los cuales el usuario es propietario
        // Project base
        {
          idProject: 1,
          nameProject: "New Project",
          tasks: [{
            idTask: crypto.randomUUID(),
            nameTask: "New Task",
            description: "Desc",
            deadLine: date,
            status: "PENDING",
            priority: "HIGH",
            usersAsigned: [], //* Todos los usuarios asignado a la tarea
          }],
          sharedUsers: [] //* Todas los usuarios que participan en el proyecto, (UUID)
        },
      ],
      sharedProjects: [], //* Todos los proyectos compartidos con el usuario
    }
  ])

  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(dataUser))
  }
  const [projects, setProjects] = React.useState([
    {
      id: 1,
      info: { title: "Alpha", desc: "...", color: "#fff" },
      tasks: [
        { id: 1, title: "Tarea", desc: "...", status: "todo" }
      ]
    }
  ])

  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:projectId" element={<Dashboard />} />
        <Route path="/projects/:userId" element={<ProjectsViewer />} />
      </Routes>

    </ChakraProvider>
  );
}
