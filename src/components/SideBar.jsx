import { useDisclosure } from "@chakra-ui/react"
import React from "react"
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, } from '@chakra-ui/react'
import { Button } from "@chakra-ui/react"
import { Link } from "react-router-dom"
export default function SideBar({ isOpen, onClose }) {

    const [placement, setPlacement] = React.useState('left')
    return (
        < Drawer placement={placement} onClose={onClose} isOpen={isOpen} >
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
        </Drawer >
    )
}