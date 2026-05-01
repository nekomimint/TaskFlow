import { useState } from 'react'
import './Login.css'
import './App.css'
import { useDisclosure } from '@chakra-ui/react'
import { useRef } from 'react'
import { Input } from '@chakra-ui/react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
} from '@chakra-ui/react'
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
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ChangeTheme from './components/mini_components/ChangeTheme'

export default function Login() {

    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [errorLogin, setErrorLogin] = useState("")
    const [errorCreate, setErrorCreate] = useState("")

    useEffect(() => {
        const data = localStorage.getItem("user")
        if (data) {
            setUsers(JSON.parse(data))
        }
    }, [])

    const handleCreateUser = (newUser) => {
        setUsers(prev => {
            const updated = [...prev, newUser]
            localStorage.setItem("user", JSON.stringify(updated))
            return updated
        })
    }

    const handleSubmit = () => {
        if (!userName.trim() || !password.trim()) {
            setErrorCreate("Todos los campos son obligatorios");
            return;
        }

        if (/^\d+$/.test(userName)) {
            setErrorCreate("El nombre de usuario no puede ser solo números");
            return;
        }

        const exists = users.some(u => u.userName === userName)

        if (exists) {
            setErrorCreate("El usuario ya existe");
            return
        }

        setErrorCreate("");

        const newUser = {
            id: crypto.randomUUID(),
            userName,
            role: "normal",
            password,
            profilePhoto: profilePhoto,
            projects: [
                {
                    idProject: crypto.randomUUID(),
                    nameProject: "New Project",
                    tasks: [{
                        idTask: crypto.randomUUID(),
                        nameTask: "New Task",
                        description: "Desc",
                        deadLine: "date",
                        status: "PENDING"
                    }]
                }
            ]
        }

        handleCreateUser(newUser)

        // RF23 - Guardar currentUserId para que SideBar siempre lo encuentre
        localStorage.setItem("currentUserId", newUser.id)

        navigate(`/projects/${newUser.id}`)
    }

    const [userNameLogin, setUserNameLogin] = useState("")
    const [passwordLogin, setPasswordLogin] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const [pendingData, setPendingData] = useState(null)  // guarda el JSON antes de confirmar

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result)
                if (!Array.isArray(parsed)) {
                    alert("El archivo no tiene el formato correcto")
                    return
                }
                setPendingData(parsed)  // guarda los datos
                onOpen()               // abre el dialog
            } catch {
                alert("El archivo no es un JSON válido")
            }
        }
        reader.readAsText(file)
    }

    const confirmImport = () => {
        localStorage.setItem("user", JSON.stringify(pendingData))
        setUsers(pendingData)
        setPendingData(null)
        onClose()

    }
    function handleLogin() {
        if (!userNameLogin.trim() || !passwordLogin.trim()) {
            setErrorLogin("Debes llenar todos los campos");
            return;
        }

        const userFound = users.find(user =>
            user.userName === userNameLogin &&
            user.password === passwordLogin
        )

        if (!userFound) {
            setErrorLogin("Usuario o contraseña incorrectos");
            return;
        }

        setErrorLogin("");

        // ✅ RF23 - Guardar currentUserId al hacer login
        localStorage.setItem("currentUserId", String(userFound.id))

        navigate(`/projects/${userFound.id}`)
    }

    const [preview, setPreview] = useState('/photos/defaultUser.png')

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file) return

        if (file.size > 1 * 1024 * 1024) {
            alert("La imagen no puede superar 1MB")
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result
            setProfilePhoto(base64)
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

    return (
        <>
            <Box className="contenedorLogin">
                <Center>
                    <div className="blurBG"></div>

                    <AnimatePresence mode="wait">
                        {createAccount ? (
                            <motion.div
                                key="crear"
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="createUser"
                            >
                                <ChangeTheme />
                                <Stack direction={['column']} spacing='24px'>
                                    <Heading textAlign="Center" as="h2" size="md">Nueva cuenta</Heading>
                                    <Flex {...getRootProps()} className="avatarContainer">
                                        <input {...getInputProps()} />
                                        <Avatar src={profilePhoto} size="xl" opacity={isDragActive ? 0.5 : 1}>
                                            <AvatarBadge boxSize='1em' bg='#c7c3ff' />
                                        </Avatar>
                                        <Text>
                                            {isDragActive ? "¡Deja caer aquí!" : "Clickea o arrastra una imagen"}
                                        </Text>
                                        {fileRejections.length > 0 && (
                                            <Text color="red.400">La imagen supera 1MB</Text>
                                        )}
                                    </Flex>

                                    <Input
                                        placeholder='Usuario | Correo electronico'
                                        focusBorderColor="#c7c3ff"
                                        borderColor="#6b6881"
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                    {errorCreate && (
                                        <Text color="red.400" textAlign="center">{errorCreate}</Text>
                                    )}
                                    <Input
                                        type="password"
                                        placeholder='Contraseña'
                                        focusBorderColor="#c7c3ff"
                                        borderColor="#6b6881"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Center>
                                        <Button onClick={() => setCreateAccount(false)}>
                                            ¿Ya tienes una cuenta?
                                        </Button>
                                        <Button
                                            className="loginButton"
                                            onClick={handleSubmit}
                                            bg="#c7c3ff"
                                            _hover={{ bg: "#7b789b" }}
                                            _active={{ bg: "#47455c" }}
                                            _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                        >
                                            Crear cuenta
                                        </Button>
                                    </Center>
                                </Stack>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="userLogin"
                            >
                                <ChangeTheme />
                                <Stack direction={['column']} spacing='24px'>
                                    <Heading textAlign="Center" as="h1" size="2xl">Task Flow</Heading>
                                    <Heading textAlign="Center" as="h2" size="md">Iniciar sesión</Heading>
                                    {errorLogin && (
                                        <Text color="red.400" textAlign="center">{errorLogin}</Text>
                                    )}
                                    <Input
                                        placeholder='Usuario | Correo electronico'
                                        focusBorderColor="#c7c3ff"
                                        borderColor="#6b6881"
                                        onChange={(e) => setUserNameLogin(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder='Contraseña'
                                        focusBorderColor="#c7c3ff"
                                        borderColor="#6b6881"
                                        onChange={(e) => setPasswordLogin(e.target.value)}
                                    />
                                    <Center>
                                        <Button onClick={() => setCreateAccount(true)}>
                                            Crear una cuenta
                                        </Button>
                                        <Button
                                            className="loginButton"
                                            onClick={handleLogin}
                                            bg="#c7c3ff"
                                            _hover={{ bg: "#7b789b" }}
                                            _active={{ bg: "#47455c" }}
                                            _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                        >
                                            Entrar
                                        </Button>
                                    </Center>
                                    <Center mt={2}>
                                        <label className="profileImportLabel">
                                            <input
                                                type="file"
                                                accept=".json"
                                                onChange={handleImport}
                                                style={{ display: "none" }}
                                            />
                                            Importar datos desde JSON
                                        </label>
                                    </Center>
                                </Stack>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </Center>
            </Box>
            <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Importar datos</AlertDialogHeader>
                        <AlertDialogBody>
                            ¿Estás seguro? Esto reemplazará todos los datos actuales.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="blue" onClick={confirmImport}>
                                Importar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}