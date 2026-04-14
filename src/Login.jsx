import { useState } from 'react'
import './App.css'
import './Login.css'
import { Input } from '@chakra-ui/react'
import { ChakraProvider, Button } from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { Center, Square, Circle } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Link } from "react-router-dom";
import { Link as ReactRouterLink } from 'react-router-dom'
import { Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Flex } from '@chakra-ui/react'
export default function Login() {

    const [preview, setPreview] = useState('/photos/defaultUser.png')
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file) return
        // validar 1MB
        if (file.size > 1 * 1024 * 1024) {
            alert("La imagen no puede superar 1MB")
            return
        }

        // convertir a base64 para guardar en localStorage
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result
            setPreview(base64)

            // guardar en localStorage
            const datos = JSON.parse(localStorage.getItem("taskflow") || "{}")
            datos.usuario = { ...datos.usuario, fotoPerfil: base64 }
            localStorage.setItem("taskflow", JSON.stringify(datos))
        }
        reader.readAsDataURL(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        maxSize: 1 * 1024 * 1024
    })

    const [createAccount, setCreateAccount] = useState(false)
    console.log(createAccount)
    return (
        <>
            <Box className="contenedorLogin">
                <Center>
                    <div className="blurBG"></div>


                    <AnimatePresence mode="wait">
                        {createAccount ?
                            ( /* If true*/
                                /* Create account */

                                <motion.div
                                    key="crear"
                                    initial={{ opacity: 0, x: -100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }}
                                    className="createUser">

                                    <Stack direction={['column']} spacing='24px'>
                                        <Heading textAlign="Center" as="h2" size="md">Nueva cuenta</Heading>
                                        <Flex {...getRootProps()} className="avatarContainer">
                                            <input {...getInputProps()} />
                                            <Avatar src={preview} size="xl" opacity={isDragActive ? 0.5 : 1}>
                                                <AvatarBadge boxSize='1em' bg='#c7c3ff' />
                                            </Avatar>
                                            <Text>
                                                {isDragActive ? "¡Deja caer aquí!" : "Clickea o arrastra una imagen"}
                                            </Text>
                                            {fileRejections.length > 0 && (
                                                <Text color="red.400">La imagen supera 1MB</Text>
                                            )}
                                        </Flex>

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
                                            <Button onClick={() => setCreateAccount(false)}>
                                                ¿Ya tienes una cuenta?
                                            </Button>
                                            <Link to="/projects">
                                                <Button className="loginButton"
                                                    bg="#c7c3ff"
                                                    _hover={{ bg: "#7b789b" }}
                                                    _active={{ bg: "#47455c" }}
                                                    _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                                >Entrar</Button>
                                            </Link>
                                        </Center>
                                    </Stack>

                                </motion.div>
                            ) : ( /* If false*/
                                /* Loggin into */
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 100 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }}
                                    className="userLogin">

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
                                            <Button onClick={() => setCreateAccount(true)}>
                                                Crear una cuenta
                                            </Button>
                                            <Link to="/projects">
                                                <Button className="loginButton"
                                                    bg="#c7c3ff"
                                                    _hover={{ bg: "#7b789b" }}
                                                    _active={{ bg: "#47455c" }}
                                                    _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                                >Entrar</Button>
                                            </Link>
                                        </Center>
                                    </Stack>

                                </motion.div>
                            )
                        }
                    </AnimatePresence>

                </Center >
            </Box>

        </>
    )
}
