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
import { DragDropProvider } from '@dnd-kit/react';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import { Progress } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Dashboard() {

    const { projectId } = useParams();

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

            // ✅ FIX: comparar como strings para evitar number vs string
            const foundOwner = parsed.find(user =>
                user.projects.some(p => String(p.idProject) === String(projectId))
            );

            if (foundOwner) {
                console.log("parsed:", parsed)
                console.log("projectId:", projectId)
                console.log("userId :", foundOwner.id)
                console.log("foundOwner:", foundOwner)
                setOwner(foundOwner.id)

                // ✅ FIX: comparar como strings aquí también
                const foundProject = foundOwner.projects.find(
                    p => String(p.idProject) === String(projectId)
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
        { id: "DOING",   title: "En progreso" },
        { id: "DONE",    title: "Terminado" }
    ]

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "DONE").length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const pendingTasks = tasks.filter(task => task.status !== "DONE").length;

    const pieData = [
        { name: "Completadas", value: completedTasks },
        { name: "Pendientes",  value: pendingTasks }
    ];

    const projectSummary = users.flatMap(user =>
        user.projects.map(project => {
            const total = project.tasks.length;
            const completed = project.tasks.filter(t => t.status === "DONE").length;
            const pending = total - completed;
            return {
                id: project.idProject,
                name: project.name || `Proyecto ${project.idProject}`,
                total, completed, pending
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

    return (
        <>
            <Box className="contenedorDashboard">
                <div className="dashboardBG"></div>

                <Flex className="contenedorTareas">
                    <Box className="menuOpciones">
                        <SideBar
                            context={"dashboard"}
                            userId={owner}
                        />
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
                            <Tab>Calendario</Tab>
                            <Tab>Resumen</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <DragDropProvider
                                    onDragEnd={(event) => {
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
                                        handleMoved(taskId, newStatus);
                                    }}
                                >
                                    <Flex className="listaTareas">
                                        {COLUMNS.map((column) => (
                                            <Column
                                                key={column.id}
                                                column={column}
                                                tasks={tasks.filter(task => task.status === column.id)}
                                                onEditTask={handleEditTask}
                                                onDeleteTask={handleDeleteTask}
                                            />
                                        ))}
                                    </Flex>
                                </DragDropProvider>
                            </TabPanel>

                            <TabPanel>
                                <CalendarView tasks={tasks} />
                            </TabPanel>

                            <TabPanel>
                                <Flex gap={10} align="flex-start" wrap="wrap">
                                    <Box mb={6}>
                                        <p style={{ fontWeight: "bold" }}>Resumen general</p>
                                        {projectSummary.length === 0 ? (
                                            <p>No hay proyectos</p>
                                        ) : (
                                            projectSummary.map(p => (
                                                <Box key={p.id} p={3} mb={2} border="1px solid gray" borderRadius="8px">
                                                    <strong>{p.name}</strong><br />
                                                    Total tareas: {p.total}<br />
                                                    Completadas: {p.completed}<br />
                                                    Pendientes: {p.pending}
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