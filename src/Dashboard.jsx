import './dashboard.css';
import { useState } from 'react'
import './App.css'
import { Input } from '@chakra-ui/react'
import { ChakraProvider, Button } from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { Center, Square, Circle } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { RadioGroup, Radio } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Column from './components/Column'
import ModalTask from "./components/ModalTask"
import SideBar from "./components/SideBar"
import { DragDropProvider } from '@dnd-kit/react';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
export default function Dashboard() {

    const { projectId } = useParams();

    const [users, setUsers] = useState([]);
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            const parsed = JSON.parse(data);
            setUsers(parsed);

            // Todo en el mismo useEffect, ya tienes los datos aquí
            const foundProject = parsed[0]?.projects?.find(
                p => p.idProject === Number(projectId)
            );

            if (foundProject) {
                setProject(foundProject);
                setTasks(foundProject.tasks);
            }
        }
    }, [projectId]);

        const handleEditTask = (idTask, newTitle, newDesc) => {
        const updatedTasks = tasks.map(task =>
            task.idTask === idTask
                ? { ...task, nameTask: newTitle, description: newDesc }
                : task
        );

        setTasks(updatedTasks);
        saveProject({ ...project, tasks: updatedTasks });
    };

        const handleDeleteTask = (taskId) => {
        const updatedTasks = tasks.filter(task =>
            task.idTask !== taskId
        );

        setTasks(updatedTasks);
        saveProject({ ...project, tasks: updatedTasks });
    };

    const handleCreateTask = (newTask) => {
        const updatedProject = {
            ...project, //* Copiar el proyecto
            tasks: [...tasks, newTask] //* Copiar todas las tareas mas la nueva
        };
        setTasks(updatedProject.tasks); //* Decirle a react que actualice el estado
        saveProject(updatedProject); //* mandar el nuevo proyecto a guardar en JSON
    };
    const handleUpdateTask = (updatedTask) => {
        const updatedProject = {
            ...project, //* Copiado de proyecto (copy)
            tasks: tasks.map(task => //* Ciclo for para recorrer cada task
                task.idTask === updatedTask.idTask  //* ¿Es la que queremos actualizar?
                    ? updatedTask           //* Sí → la reemplaza, osea el updatedTask sustituye al task que este en el id
                    : task                 //* No → la deja igual
            )
        };
        setTasks(updatedProject.tasks);
        saveProject(updatedProject); //* Esto es una funcion que hicimos para guardar el nuevo json generado en localstorage
    };
    //* Guardar el proyecto en localstorage para no perder si recargamos
    const saveProject = (updatedProject) => {
        setProject(updatedProject);   //* Actualiza el estado de React (osea re-renderizar)

        setUsers(prev => {
            const updated = prev.map(user => ({
                ...user, //* Copiar todos los usuario (buena practica)
                projects: user.projects.map(p => //* Recorremos todos los proyectos
                    p.idProject === updatedProject.idProject
                        ? updatedProject   //* encuentra el proyecto por id y lo reemplaza, esto es una triplete
                        : p //* Si es el proyecto a actualizar lo cambiamos, si no lo dejamos como esta (siempre deberia ser true)
                )
            }));
            localStorage.setItem("user", JSON.stringify(updated));  //* Guardar en localStorage el nuevo objeto
            return updated; //* Le decimos a React que actualice el estado
        });
    };
  
    //* Funcion para cuando movemos las tareas actualizar su status no solo en pagina si no en JSON tambien
    const handleMoved = (taskId, newStatus) => {
        const updatedProject = {
            ...project,
            tasks: tasks.map(task =>
                task.idTask === taskId
                    ? { ...task, status: newStatus }  // copia la task y reemplaza solo el status
                    : task
            )
        };
        setTasks(updatedProject.tasks);
        saveProject(updatedProject);
    };

    //* Unas constantes que usa chakra
    const drawer = useDisclosure()

    const modal = useDisclosure()


    const COLUMNS = [
        {
            id: "PENDING",
            title: "Pendiente"
        },
        {
            id: "DOING",
            title: "En progreso"
        },
        {
            id: "DONE",
            title: "Terminado"
        }
    ]



    return (
        <>
            {/* Contenido principal (no barra lateral) */}
            <Box className="contenedorDashboard">
                <div className="dashboardBG"></div>

                <Flex className="contenedorTareas">
                    <Box className="menuOpciones">
                        {/* //* Boton que abre la barra lateral */}
                        <Button colorScheme='blue' onClick={drawer.onOpen}>
                            Open

                        </Button>
                        <SideBar
                            isOpen={drawer.isOpen}
                            onClose={drawer.onClose}
                        />
                        {/* //* Boton para agregar nuevas tareas */}
                        <Button colorScheme='blue' onClick={modal.onOpen}>

                            Nueva tarea

                            <ModalTask
                                isOpen={modal.isOpen}
                                onClose={modal.onClose}
                                onCreateTask={handleCreateTask}
                                projectId={projectId}
                            />
                        </Button>
                        <div>
                            Current project: {projectId}
                        </div>
                    </Box>
                    <Tabs>
                        <TabList>
                            <Tab>Tareas</Tab>
                            <Tab>Resumen</Tab>
                            <Tab>Three</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <DragDropProvider

                                    onDragEnd={(event) => {
                                        console.log(event);
                                        console.log("EVENT:", event);
                                        console.log("SOURCE:", event.operation.source);
                                        console.log("TARGET:", event.operation.target);
                                        if (event.canceled) return;

                                        const taskId = event.operation.source?.id;
                                        const newStatus = event.operation.target?.id;

                                        if (!newStatus) return;

                                        setTasks((prev) =>
                                            prev.map((task) =>
                                                task.idTask === taskId
                                                    ? { ...task, status: newStatus }
                                                    : task
                                            )

                                        );
                                        handleMoved(taskId, newStatus);  // aquí
                                    }
                                    }
                                >

                                    <Flex className="listaTareas" >
                                        {COLUMNS.map((column) => {
                                            return <Column 
                                             key={column.id}
                                             column={column}
                                             tasks={tasks.filter(task => task.status === column.id)} 
                                             onEditTask={handleEditTask} 
                                             onDeleteTask={handleDeleteTask} />
                                        })}
                                    </Flex>
                                </DragDropProvider>
                            </TabPanel>
                            <TabPanel>
                                <p>Calendario</p>
                            </TabPanel>
                            <TabPanel>
                                <p>three!</p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                </Flex>

            </Box >

            {/* //* Esto es la barra lateral */}

        </>
    )
}
