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

export default function Dashboard({ projectId, createTasks }) {


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


    const [tasks, setTasks] = React.useState([])


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
                            <SideBar
                                isOpen={drawer.isOpen}
                                onClose={drawer.onClose}
                            />
                        </Button>
                        {/* //* Boton que abre la barra lateral */}
                        <Button colorScheme='blue' onClick={modal.onOpen}>

                            Nueva tarea

                            <ModalTask
                                isOpen={modal.isOpen}
                                onClose={modal.onClose}
                                onCreateTask={createTasks}
                                projectId={projectId}
                            />
                        </Button>
                    </Box>
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
                                    task.id === taskId
                                        ? { ...task, status: newStatus }
                                        : task
                                )

                            );
                        }}
                    >
                        <Flex className="listaTareas" >
                            {COLUMNS.map((column) => {
                                return <Column key={column.id} column={column} tasks={tasks.filter(task => task.status === column.id)} />
                            })}
                        </Flex>
                    </DragDropProvider>
                </Flex>

            </Box >

            {/* //* Esto es la barra lateral */}

        </>
    )
}
