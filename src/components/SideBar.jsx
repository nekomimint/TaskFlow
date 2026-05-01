import { useDisclosure } from "@chakra-ui/react"
import React from "react"
import { Button } from "@chakra-ui/react";
import {
    Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
} from '@chakra-ui/react'
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react'
import { Link, useNavigate } from "react-router-dom"
import ChangeTheme from "./mini_components/ChangeTheme"
import ButtonIcon from "./ButtonIcon";
import AppIcon from "./AppIcon";
import "./SideBar.css"

export default function SideBar({ context, userId }) {

    const [placement] = React.useState('left')
    const drawer = useDisclosure();
    const alertDialog = useDisclosure();
    const cancelRef = React.useRef();
    const navigate = useNavigate();

    // Obtiene el userId de forma segura
    const getSafeUserId = () => {
        if (userId != null) return String(userId);
        const stored = localStorage.getItem("currentUserId");
        if (stored) return stored;
        const users = JSON.parse(localStorage.getItem("user") || "[]");
        return users?.[0]?.id ? String(users[0].id) : null;
    };

    // RF23 - Eliminar proyectos y tareas, mantener la cuenta del usuario
    const handleDeleteAllData = () => {
        const data = JSON.parse(localStorage.getItem("user") || "[]");

        const resetData = data.map(user => ({
            ...user,
            projects: [],
            sharedProjects: [{ idProject: null, tasksAssigned: [] }]
        }));

        localStorage.removeItem("activity");
        localStorage.setItem("user", JSON.stringify(resetData));

        // Notificar a ProjectsViewer que el localStorage cambió
        window.dispatchEvent(new Event("localStorageUpdated"));

        alertDialog.onClose();
        drawer.onClose();

        navigate(`/projects/${getSafeUserId()}`);
    };

    return (
        <>
            <ButtonIcon
                onClick={drawer.onOpen}
                icon={<AppIcon name={"LuChevronFirst"} />}
                label="Abrir menú"
                className="buttonOpen"
            />

            <Drawer placement={placement} onClose={drawer.onClose} isOpen={drawer.isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Menú</DrawerHeader>
                    <DrawerBody display="flex" flexDirection="column" gap={3}>
                        <ChangeTheme />
                        <Button onClick={drawer.onClose}>Quit</Button>
                        {context !== "projects" && (
                            <Link to={`/projects/${getSafeUserId()}`}>
                                <Button w="100%">Mis proyectos</Button>
                            </Link>
                        )}
                        <Link to="/login">
                            <Button
                                w="100%"
                                className="loginButton"
                                bg="#c7c3ff"
                                _hover={{ bg: "#7b789b" }}
                                _active={{ bg: "#47455c" }}
                                _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                            >
                                Cerrar sesión
                            </Button>
                        </Link>

                        {/* RF23 - Botón eliminar todos los datos */}
                        <Button
                            mt={2}
                            w="100%"
                            colorScheme="red"
                            variant="outline"
                            onClick={alertDialog.onOpen}
                            leftIcon={<AppIcon name="LuTrash2" />}
                        >
                            Eliminar todos los datos
                        </Button>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* RF23 - Modal de confirmación */}
            <AlertDialog
                isOpen={alertDialog.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={alertDialog.onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar todos los datos
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Esta acción eliminará <strong>todos los proyectos, tareas y actividad</strong>.
                            Tu cuenta se mantendrá intacta.
                            <br /><br />
                            ¿Estás seguro de que deseas continuar?
                        </AlertDialogBody>
                        <AlertDialogFooter gap={3}>
                            <Button ref={cancelRef} onClick={alertDialog.onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteAllData}>
                                Sí, eliminar todo
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}