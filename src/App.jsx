import { ChakraProvider, Button } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login"
import Dashboard from "./dashboard"
import ProjectsViewer from "./ProjectsViewer"
import Profile from "./components/Profile"
import React from "react";
import { useState } from "react";
export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const dataUser = ([
    {
      id: crypto.randomUUID(),
      userName: "New User",
      role: "normal",
      profilePhoto: null, // This can be null is user not upload photo and will passed as base64
      password: "DefaultPassword",
      projects: [ //* Todos los proyectos de los cuales el usuario es propietario
        // Project base
        {
          idProject: crypto.randomUUID(),
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
          sharedUsers: [] //* Todas los usuarios que participan en el proyecto, (nombre)
        },
      ],
      sharedProjects: [
        {
          ownerId: null,
          idProject: null,
          tasksAssigned: []
        }

      ], //* Todos los proyectos compartidos con el usuario
    }
  ])

  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(dataUser))
  }
  const [projects, setProjects] = React.useState([
    {
      id: crypto.randomUUID(),
      info: { title: "Alpha", desc: "...", color: "#fff" },
      tasks: [
        { id: crypto.randomUUID(), title: "Tarea", desc: "...", status: "todo" }
      ]
    }
  ])

  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:userId/:projectId" element={<Dashboard />} />
        <Route path="/projects/:userId" element={<ProjectsViewer />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>

    </ChakraProvider>
  );
}
