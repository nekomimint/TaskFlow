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
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { h1 } from 'framer-motion/client'
import { useRef } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { RadioGroup, Radio } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Column from './components/Column'
import { DragDropProvider } from '@dnd-kit/react';
import Draggable from './Draggable';
import Droppable from './Droppable';

export default function Dashboard() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement, setPlacement] = React.useState('left')

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

    const INITIAL_TASKS = [
        {
            id: 1,
            title: "Nueva Tarea",
            description: "Una tarea para pruebas.",
            status: "PENDING"
        },
        {
            id: 2,
            title: "Jugar Osu",
            description: "Hay que seguir practicando.",
            status: "DOING"
        },
        {
            id: 3,
            title: "Terminar el proyecto de DBEP",
            description: "Seguimos con diseño y funcionalidades.",
            status: "DONE"
        }
    ]

    const [tasks, setTasks] = useState(INITIAL_TASKS);



    return (
        <>
            {/* Contenido principal (no barra lateral) */}
            <Box className="contenedorDashboard">
                <div className="dashboardBG"></div>

                <Flex className="contenedorTareas">
                    <Box className="menuOpciones">
                        {/* //* Boton que abre la barra lateral */}
                        <Button colorScheme='blue' onClick={onOpen}>
                            Open
                        </Button>
                    </Box>
                    <Flex className="listaTareas" >
                        {COLUMNS.map((column) => {
                            return <Column key={column.id} column={column} tasks={tasks.filter(task => task.status === column.id)} />
                        })}
                    </Flex>
                </Flex>

            </Box>

            {/* //* Esto es la barra lateral */}
            <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Menú</DrawerHeader>
                    <DrawerBody>
                        <p>Some contents...</p>
                        <Button onClick={onClose}>
                            Quit
                        </Button>
                        <Link to="/login">
                            <Button className="loginButton"
                                bg="#c7c3ff"
                                _hover={{ bg: "#7b789b" }}
                                _active={{ bg: "#47455c" }}
                                _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                            >Cerrar sesión</Button>
                        </Link>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
