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
import CalendarView from "./components/tasks/CalendarView";
import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { RadioGroup, Radio } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Column from './components/projects_components/Column'
import ModalTask from "./components/tasks/ModalTask"
import SideBar from "./components/SideBar"
import { arrayMove } from '@dnd-kit/sortable';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { Text } from '@chakra-ui/react';
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
    const [columns, setColumns] = useState([
        { id: "PENDING", title: "Pendiente" },
        { id: "DOING", title: "En progreso" },
        { id: "DONE", title: "Terminado" }
    ])
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(PointerSensor)
    )
    const [activeTask, setActiveTask] = useState(null)

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            const parsed = JSON.parse(data);
            setUsers(parsed);

            // FIX: comparar como strings para evitar number vs string
            const foundOwner = parsed.find(user =>
                user.projects.some(p => String(p.idProject) === String(projectId))
            );
            // console.log("foundOwner:", foundOwner)  // ¿es undefined?
            // console.log("projectId:", projectId, typeof projectId)
            // console.log("idProjects en JSON:", parsed.flatMap(u => u.projects.map(p => ({ id: p.idProject, tipo: typeof p.idProject }))))
            // console.log("parsed:", parsed)
            // console.log("projectId:", projectId)
            // console.log("userId :", (foundOwner.id))
            // console.log("foundOwner:", foundOwner)
            setOwner(foundOwner.id)  // para usarlo fuera del useEffect

            if (foundOwner) {
                // console.log("parsed:", parsed)
                // console.log("projectId:", projectId)
                // console.log("userId :", foundOwner.id)
                // console.log("foundOwner:", foundOwner)
                setOwner(foundOwner.id)

                // FIX: comparar como strings aquí también
                const foundProject = foundOwner.projects.find(
                    p => String(p.idProject) === String(projectId)
                );
                setProject(foundProject);
                setTasks(foundProject.tasks);
            }
        }
    }, [projectId]);


    const ownerName = users.find(u =>
        u.projects.some(p => p.idProject === projectId)
    )?.userName
    // console.log("Dueno: ", ownerName)
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
            ...project,
            tasks: [...tasks, newTask]
        };
        setTasks(updatedProject.tasks);
        saveProject(updatedProject);
        addActivity(`Se creó la tarea "${newTask.nameTask}"`);
    };

    const handleUpdateTask = (updatedTask) => {
        const updatedProject = {
            ...project,
            tasks: tasks.map(task =>
                task.idTask === updatedTask.idTask
                    ? updatedTask
                    : task
            )
        };
        setTasks(updatedProject.tasks);
        saveProject(updatedProject);
    };

    const saveProject = (updatedProject) => {
        setProject(updatedProject);
        setUsers(prev => {
            const updated = prev.map(user => ({
                ...user,
                projects: user.projects.map(p =>
                    // ✅ FIX: comparar como strings
                    String(p.idProject) === String(updatedProject.idProject)
                        ? updatedProject
                        : p
                )
            }));
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });
    };

    const handleMoved = (taskId, newStatus) => {
        const updatedProject = {
            ...project,
            tasks: tasks.map(task =>
                task.idTask === taskId
                    ? { ...task, status: newStatus }
                    : task
            )
        };
        setTasks(updatedProject.tasks);
        saveProject(updatedProject);
        const movedTask = tasks.find(t => t.idTask === taskId);
        addActivity(`Se movió la tarea "${movedTask?.nameTask}" a ${newStatus}`);
    };

    const drawer = useDisclosure()
    const modal = useDisclosure()

    const COLUMNS = [
        { id: "PENDING", title: "Pendiente" },
        { id: "DOING", title: "En progreso" },
        { id: "DONE", title: "Terminado" }
    ]

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "DONE").length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const pendingTasks = tasks.filter(task => task.status !== "DONE").length;

    const pieData = [
        { name: "Completadas", value: completedTasks },
        { name: "Pendientes", value: pendingTasks }
    ];

    const projectSummary = users.flatMap(user =>
        user.projects.map((project, index) => {
            const total = project.tasks.length;
            const completed = project.tasks.filter(t => t.status === "DONE").length;
            const pending = total - completed;


            return {
                id: project.idProject,
                name: project.name?.trim()
                    ? project.name
                    : `Proyecto ${index + 1}`,
                total,
                completed,
                pending,
                ownerName: user.name || user.username || `Propietario: ${user.userName}`
            };
        })
    );

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
        const total = totalTasks || 1;
        const percentage = Math.round((value / total) * 100);
        return `${percentage}%`;
    };


    // console.log("Usuarios: ", users)
    return (
        <>
            <Box className="contenedorDashboard">

                <div className="dashboardBG"></div>

                <Flex className="contenedorTareas">

                    <div className="headerDashboard">
                        <SideBar
                            context={"dashboard"}
                            userId={owner}
                        />
                    </div>
                    <Box className="menuOpciones" >

                        <Button colorScheme='blue' onClick={modal.onOpen}>
                            Nueva tarea

                        </Button>
                        <ModalTask
                            isOpen={modal.isOpen}
                            onClose={modal.onClose}
                            onCreateTask={handleCreateTask}
                            projectId={projectId}
                            usersShared={project?.sharedUsers ?? []}
                            ownerName={ownerName}
                            allUsers={users}
                        />
                        <Box display={'flex'} flexDir={'column'}>
                            <Text fontSize='xl'>Progreso del proyecto: {progress}%</Text>
                            <Progress value={progress} colorScheme="green" rounded={'10px'} />
                        </Box>
                    </Box>

                    <Tabs>
                        <TabList display={'flex'} justifyContent={'space-around'} paddingLeft={1} paddingRight={1}>
                            <Tab>Tareas</Tab>
                            <Tab>Calendario</Tab>
                            <Tab>Resumen</Tab>
                        </TabList>

                        <TabPanels className="panelsTabular" display={'flex'} flexDir={'column'} justifyContent={'center'} >
                            <TabPanel className="panelModule" m={0} p={0}  >
                                <DndContext
                                    sensors={sensors}
                                    onDragStart={(event) => {
                                        if (event.active.data.current?.type === "task") {
                                            setActiveTask(tasks.find(t => t.idTask === event.active.id))
                                        }
                                    }}
                                    onDragEnd={(event) => {
                                        const { active, over } = event
                                        if (!over) return


                                        const sourceId = active.id
                                        const targetId = over.id
                                        const type = active.data.current?.type

                                        console.log("type:", type)
                                        console.log("sourceId:", sourceId)
                                        console.log("targetId:", targetId)
                                        console.log("containerId source:", active.data.current?.sortable?.containerId)
                                        console.log("containerId target:", over.data.current?.sortable?.containerId)
                                        if (type === "task") {
                                            const sourceContainer = active.data.current?.sortable?.containerId
                                            const targetContainer = over.data.current?.sortable?.containerId ?? over.id

                                            if (sourceContainer !== targetContainer) {
                                                // Se mueve a otra columna, targetId debe ser el status de la columna
                                                const newStatus = over.data.current?.type === "task"
                                                    ? over.data.current?.sortable?.containerId  // soltó sobre una tarea
                                                    : over.id  // soltó sobre la columna directamente
                                                handleMoved(sourceId, newStatus)
                                            } else {
                                                // Reordena dentro de la misma columna
                                                setTasks(prev => {
                                                    const oldIndex = prev.findIndex(t => t.idTask === sourceId)
                                                    const newIndex = prev.findIndex(t => t.idTask === targetId)
                                                    const reordered = arrayMove(prev, oldIndex, newIndex)
                                                    saveProject({ ...project, tasks: reordered })
                                                    return reordered
                                                })
                                            }
                                        }

                                        if (type === "column") {
                                            setColumns(prev => {
                                                const oldIndex = prev.findIndex(c => c.id === sourceId)
                                                const newIndex = prev.findIndex(c => c.id === targetId)
                                                const updated = [...prev]
                                                updated.splice(oldIndex, 1)
                                                updated.splice(newIndex, 0, prev[oldIndex])
                                                return updated
                                            })
                                        }
                                    }}
                                >
                                    <Flex className="listaTareas">
                                        {columns.map((column) => (
                                            <Column
                                                key={column.id}
                                                column={column}
                                                tasks={tasks.filter(task => task.status === column.id)}
                                                onEditTask={handleEditTask}
                                                onDeleteTask={handleDeleteTask}
                                            />
                                        ))}
                                    </Flex>
                                </DndContext>
                            </TabPanel>

                            <TabPanel>
                                <CalendarView tasks={tasks} />
                            </TabPanel>

                            <TabPanel>
                                <Flex gap={10} align="flex-start" wrap="wrap" className="listaProyectos">
                                    { }
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
                                                    {
                                                        // console.log("Resumen de proyecto: ", projectSummary)
                                                        //console.log("Objeto traido: ",p)
                                                    }
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
                                                    outerRadius={90}
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

                                    <Box flex="1">
                                        <p>Actividad reciente</p>
                                        {activity.length === 0 ? (
                                            <p>No hay actividad aún</p>
                                        ) : (
                                            activity.map(item => (
                                                <Box key={item.id} p={2} borderBottom="1px solid gray">
                                                    <strong>{item.message}</strong><br />
                                                    <small>{item.date}</small>
                                                </Box>
                                            ))
                                        )}
                                    </Box>
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>
            </Box>
        </>
    )
}