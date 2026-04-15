import { ChakraProvider, Button } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./login"
import Dashboard from "./dashboard"
import ProjectsViewer from "./ProjectsViewer"
import React from "react";
export default function App() {

  const dataUser = ([
    {
      id: 1,
      userName: "New User",
      profilePhoto: null, // This can be null is user not upload photo and will passed as base64
      password: "DefaultPassword",
      projects: [
        // Project base
        {
          idProject: 1,
          nameProject: "New Project",
          tasks: [{
            idTask: "1",
            nameTask: "New Task",
            description: "Desc",
            status: "PENDING"
          }]
        },
        // Project ends
        // Project base
        {
          idProject: 4,
          nameProject: "Second project",
          tasks: [{
            idTask: "1",
            nameTask: "New Task",
            description: "Desc",
            status: "PENDING"
          }]
        },
        // Project ends
        // Project base
        {
          idProject: 7,
          nameProject: "Ultimate tasker",
          tasks: [{
            idTask: "1",
            nameTask: "New Task",
            description: "Desc",
            status: "PENDING"
          }]
        },
        // Project ends
      ]

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
        <Route path="/projects" element={<ProjectsViewer />} />
      </Routes>

    </ChakraProvider>
  );
}
