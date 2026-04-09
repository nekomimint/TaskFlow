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
import { Link as ReactRouterLink } from 'react-router-dom'

export default function Login() {
    return (
        <>
            <Box className="contenedorLogin">
                <Center>
                    <div className="blurBG"></div>
                    <Box className="userLogin">
                        <Stack direction={['column']} spacing='24px'>
                            <Heading textAlign="Center" as="h1" size="2xl">Task Flow</Heading>
                            <Heading textAlign="Center" as="h2" size="md">Iniciar sesión</Heading>
                            <Input placeholder='Usuario | Correo electronico'
                                focusBorderColor="#c7c3ff"
                                borderColor="#6b6881"
                            />
                            <Input type="password"
                                placeholder='Contraseña'
                                focusBorderColor="#c7c3ff"
                                borderColor="#6b6881"
                            />
                            <Center>
                                <Link to="/dashboard">
                                    <Button className="loginButton"
                                        bg="#c7c3ff"
                                        _hover={{ bg: "#7b789b" }}
                                        _active={{ bg: "#47455c" }}
                                        _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                    >Entrar</Button>
                                </Link>
                            </Center>
                        </Stack>
                    </Box>
                </Center>
            </Box>

        </>
    )
}
