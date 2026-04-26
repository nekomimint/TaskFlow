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
<<<<<<< HEAD
export default function Login() {

    const [preview, setPreview] = useState('/photos/defaultUser.png')
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file) return
        // validar 1MB
=======
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
export default function Login() {

    const navigate = useNavigate()
    //* Create account
    const [users, setUsers] = useState([])
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [profilePhoto, setProfilePhoto] = useState(null)
    // Y carga el localStorage al montar el componente
    useEffect(() => {
        const data = localStorage.getItem("user")
        if (data) {
            setUsers(JSON.parse(data))
        }
    }, [])

    const handleCreateUser = (newUser) => {
        setUsers(prev => {
            const updated = [...prev, newUser]  // agrega el usuario al arreglo
            localStorage.setItem("user", JSON.stringify(updated))
            return updated
        })
    }


    const handleSubmit = () => {
        console.log("1. userName:", userName)
        console.log("2. password:", password)
        console.log("3. profilePhoto:", profilePhoto)
        if (!userName.trim() || !password.trim()) return  // validación básica

        const newUser = {
            id: crypto.randomUUID(),
            userName,
            password,
            profilePhoto: profilePhoto,
            projects: [

                {
                    idProject: 1,
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
        console.log("4. newUser creado:", newUser)

        handleCreateUser(newUser)
        console.log("5. navigate a:", `/projects/${newUser.id}`)
        navigate(`/projects/${newUser.id}`)
    }




    //* Login into account
    const [userNameLogin, setUserNameLogin] = useState("")
    const [passwordLogin, setPasswordLogin] = useState("")

    function handleLogin() {
        const userFound = users.find(user =>
            user.userName === userNameLogin &&
            user.password === passwordLogin
        )

        if (userNameLogin == null || passwordLogin == null) {

            return
        }


        if (!userFound) {

            return
        }

        navigate(`/projects/${userFound.id}`)
    }


    //* Imagenes and preview

    const [preview, setPreview] = useState('/photos/defaultUser.png')

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file) return

>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
        if (file.size > 1 * 1024 * 1024) {
            alert("La imagen no puede superar 1MB")
            return
        }

<<<<<<< HEAD
        // convertir a base64 para guardar en localStorage
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result
            setPreview(base64)

            // guardar en localStorage
            const datos = JSON.parse(localStorage.getItem("taskflow") || "{}")
            datos.usuario = { ...datos.usuario, fotoPerfil: base64 }
            localStorage.setItem("taskflow", JSON.stringify(datos))
=======
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result
            setProfilePhoto(base64)
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
        }
        reader.readAsDataURL(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        maxSize: 1 * 1024 * 1024
    })

<<<<<<< HEAD
=======
    //* Avoid create account if null params
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
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
<<<<<<< HEAD
                                            <Avatar src={preview} size="xl" opacity={isDragActive ? 0.5 : 1}>
=======
                                            <Avatar src={profilePhoto} size="xl" opacity={isDragActive ? 0.5 : 1}>
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
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
<<<<<<< HEAD
=======
                                            onChange={(e) => setUserName(e.target.value)}
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
                                        />
                                        <Input type="password"
                                            placeholder='Contraseña'
                                            focusBorderColor="#c7c3ff"
                                            borderColor="#6b6881"
<<<<<<< HEAD
=======
                                            onChange={(e) => setPassword(e.target.value)}
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
                                        />
                                        <Center>
                                            <Button onClick={() => setCreateAccount(false)}>
                                                ¿Ya tienes una cuenta?
                                            </Button>
<<<<<<< HEAD
                                            <Link to="/projects">
                                                <Button className="loginButton"
                                                    bg="#c7c3ff"
                                                    _hover={{ bg: "#7b789b" }}
                                                    _active={{ bg: "#47455c" }}
                                                    _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                                >Entrar</Button>
                                            </Link>
=======

                                            <Button className="loginButton" onClick={handleSubmit}
                                                bg="#c7c3ff"
                                                _hover={{ bg: "#7b789b" }}
                                                _active={{ bg: "#47455c" }}
                                                _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                            >Crear cuenta</Button>
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
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
<<<<<<< HEAD
=======
                                            onChange={(e) => setUserNameLogin(e.target.value)}
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
                                        />
                                        <Input type="password"
                                            placeholder='Contraseña'
                                            focusBorderColor="#c7c3ff"
                                            borderColor="#6b6881"
<<<<<<< HEAD
=======
                                            onChange={(e) => setPasswordLogin(e.target.value)}
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
                                        />
                                        <Center>
                                            <Button onClick={() => setCreateAccount(true)}>
                                                Crear una cuenta
                                            </Button>
<<<<<<< HEAD
                                            <Link to="/projects">
                                                <Button className="loginButton"
                                                    bg="#c7c3ff"
                                                    _hover={{ bg: "#7b789b" }}
                                                    _active={{ bg: "#47455c" }}
                                                    _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                                >Entrar</Button>
                                            </Link>
=======

                                            <Button className="loginButton" onClick={handleLogin}
                                                bg="#c7c3ff"
                                                _hover={{ bg: "#7b789b" }}
                                                _active={{ bg: "#47455c" }}
                                                _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                            >Entrar</Button>

>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
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
