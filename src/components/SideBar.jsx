import { useDisclosure } from "@chakra-ui/react"
import React from "react"
import { useColorMode, Button } from "@chakra-ui/react";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, } from '@chakra-ui/react'
import { Link } from "react-router-dom"
import ChangeTheme from "./mini_components/ChangeTheme"
import ButtonIcon from "./ButtonIcon";
import AppIcon from "./AppIcon";

import "./SideBar.css"
export default function SideBar({ context, userId }) {

    const [placement, setPlacement] = React.useState('left')
    const drawer = useDisclosure();
    return (

        <>
            <ButtonIcon
                onClick={drawer.onOpen}
                icon={<AppIcon name={"LuChevronFirst"} />}
                label="Borrar proyecto."
                className="buttonOpen"
            />


            < Drawer placement={placement} onClose={drawer.onClose} isOpen={drawer.isOpen} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Menú</DrawerHeader>
                    <DrawerBody>
                        <p>Some contents...</p>
                        <ChangeTheme />
                        <Button onClick={drawer.onClose}>
                            Quit
                        </Button>
                        {context !== "projects" && (  // ✅ no muestra si ya está en proyectos
                            <Link to={`/projects/${userId}`}>
                                <Button>Mis proyectos</Button>
                            </Link>
                        )}
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
            </Drawer >
        </>
    )
}