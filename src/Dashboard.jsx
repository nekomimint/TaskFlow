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
import { useDraggable } from '@dnd-kit/react';
import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { RadioGroup, Radio } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Column from './components/projects_components/Column'
import ModalTask from "./components/tasks/ModalTask"
import SideBar from "./components/SideBar"
import { DragDropProvider } from '@dnd-kit/react';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import { Progress } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
export default function Dashboard() {

    const { userId, projectId } = useParams();

    const [users, setUsers] = useState([]);
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [owner, setOwner] = useState(null)
    const [activity, setActivity] = useState([]);
    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            const parsed = JSON.parse(data);
            setUsers(parsed);

            // variable local, disponible de inmediato
            const foundOwner = parsed.find(user =>
                user.projects.some(p => p.idProject === projectId)
            );
            console.log("foundOwner:", foundOwner)  // ¿es undefined?
            console.log("projectId:", projectId, typeof projectId)
            console.log("idProjects en JSON:", parsed.flatMap(u => u.projects.map(p => ({ id: p.idProject, tipo: typeof p.idProject }))))
            console.log("parsed:", parsed)
            console.log("projectId:", projectId)
            console.log("userId :", (foundOwner.id))
            console.log("foundOwner:", foundOwner)
            setOwner(foundOwner.id)  // para usarlo fuera del useEffect

            if (foundOwner) {
                const foundProject = foundOwner.projects.find(
                    p => p.idProject === (projectId)
                );
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
        const taskToDelete = tasks.find(t => t.idTask === taskId);
        addActivity(`Se eliminó la tarea "${taskToDelete?.nameTask}"`);
    };

    const handleCreateTask = (newTask) => {
        const updatedProject = {
            ...project, //* Copiar el proyecto
            tasks: [...tasks, newTask] //* Copiar todas las tareas mas la nueva
        };
        setTasks(updatedProject.tasks); //* Decirle a react que actualice el estado
        saveProject(updatedProject); //* mandar el nuevo proyecto a guardar en JSON
        addActivity(`Se creó la tarea "${newTask.nameTask}"`);
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
        const movedTask = tasks.find(t => t.idTask === taskId);
        addActivity(`Se movió la tarea "${movedTask?.nameTask}" a ${newStatus}`);
    };

    //* Unas constantes que usa chakra
    const drawer = useDisclosure()

    const modal = useDisclosure()

    const [columns, setColumns] = useState([
        { id: "PENDING", title: "Pendiente" },
        { id: "DOING", title: "En progreso" },
        { id: "DONE", title: "Terminado" }
    ])


    // progreso
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        task => task.status === "DONE"
    ).length;

    const progress = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const pendingTasks = tasks.filter(
        task => task.status !== "DONE"
    ).length;

    const pieData = [
        { name: "Completadas", value: completedTasks },
        { name: "Pendientes", value: pendingTasks }
    ];

    const projectSummary = users.flatMap(user =>
        user.projects.map((project, index) => {
            const total = project.tasks.length;

            const completed = project.tasks.filter(
                t => t.status === "DONE"
            ).length;

            const pending = total - completed;

            return {
                id: project.idProject,
                name: project.name?.trim()
                    ? project.name
                    : `Proyecto ${index + 1}`,
                total,
                completed,
                pending,
                ownerName: user.name || user.username || `Usuario ${user.id}` // 👈 AQUÍ
            };
        })
    );

    // actividad
    const addActivity = (message) => {
        const newEntry = {
            id: Date.now(),
            message,
            date: new Date().toLocaleString()
        };

        setActivity(prev => {
            const updated = [newEntry, ...prev];
            localStorage.setItem("activity", JSON.stringify(updated));
            return updated;
        });
    };

    const renderLabel = ({ name, value }) => {
        const total = totalTasks || 1; // evitar división por 0
        const percentage = Math.round((value / total) * 100);

        return `${percentage}%`;
    };


    console.log(owner)
    return (
        <>
            {/* Contenido principal (no barra lateral) */}
            <Box className="contenedorDashboard">
                <div className="dashboardBG"></div>

                <Flex className="contenedorTareas">
                    <Box className="menuOpciones">
                        {/* //* Boton que abre la barra lateral */}


                        <SideBar
                            context={"dashboard"}
                            userId={userId}
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
                        <Box mt={4}>
                            <p>Progreso del proyecto: {progress}%</p>
                            <Progress value={progress} colorScheme="green" />
                        </Box>
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
                                        if (event.canceled) return;
                                        const type = event.operation.source?.type
                                        const sourceId = event.operation.source?.id
                                        const targetId = event.operation.target?.id
                                        if (!targetId) return

                                        if (type === "task") {
                                            handleMoved(sourceId, targetId)
                                        }

                                        if (type === "column") {
                                            setColumns(prev => {
                                                const oldIndex = prev.findIndex(c => c.id === sourceId)
                                                const newIndex = prev.findIndex(c => c.id === targetId)
                                                const updated = [...prev]
                                                updated.splice(oldIndex, 1)           // saca la columna
                                                updated.splice(newIndex, 0, prev[oldIndex])  // la mete en nueva posición
                                                return updated
                                            })
                                        }
                                    }}
                                >

                                    <Flex className="listaTareas" >
                                        {columns.map((column) => {
                                            console.log("tasks:", tasks)
                                            console.log("columns:", columns)
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
                                <Flex gap={10} align="flex-start" wrap="wrap">

                                    <Box mb={6}>
                                        <p style={{ fontWeight: "bold" }}>Resumen general</p>

                                        {projectSummary.length === 0 ? (
                                            <p>No hay proyectos</p>
                                        ) : (

                                            projectSummary.map(p => (
                                                <Box
                                                    key={p.id}
                                                    p={3}
                                                    mb={2}
                                                    border="1px solid gray"
                                                    borderRadius="8px"
                                                >
                                                    <strong>{p.name}</strong>
                                                    <br />
                                                    Total tareas: {p.total}
                                                    <br />
                                                    Completadas: {p.completed}
                                                    <br />
                                                    Pendientes: {p.pending}
                                                    <br />
                                                    {p.ownerName}
                                                </Box>
                                            ))
                                        )}
                                    </Box>

                                    {/* GRÁFICA */}
                                    <Box>
                                        <p>Resumen de tareas</p>

                                        {tasks.length === 0 ? (
                                            <p>No hay tareas</p>
                                        ) : (
                                            <PieChart width={300} height={300}>
                                                <Pie
                                                    data={pieData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    label={renderLabel}
                                                >
                                                    <Cell fill="#4CAF50" />
                                                    <Cell fill="#F44336" />
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        )}
                                    </Box>

                                    {/* HISTORIAL */}
                                    <Box flex="1">
                                        <p>Actividad reciente</p>

                                        {activity.length === 0 ? (
                                            <p>No hay actividad aún</p>
                                        ) : (
                                            activity.map(item => (
                                                <Box key={item.id} p={2} borderBottom="1px solid gray">
                                                    <strong>{item.message}</strong>
                                                    <br />
                                                    <small>{item.date}</small>
                                                </Box>
                                            ))
                                        )}
                                    </Box>

                                </Flex>
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