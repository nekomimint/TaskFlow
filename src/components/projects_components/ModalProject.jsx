import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton
} from "@chakra-ui/react"
import { useState } from 'react'
import { Flex } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { useEffect } from "react"
import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
} from '@chakra-ui/react'
import AppIcon from "../AppIcon"
import ButtonIcon from "../ButtonIcon"
function ModalProject({ isOpen, onClose, onCreateProject, ownerName }) {
    const [nameProject, setNameProject] = useState("")

    const [sharedUsers, setSharedUsers] = useState([])
    const [nameNewUser, setNameNewUser] = useState("");

    const [allUsers, setAllUsers] = useState([])

    const [error, setError] = useState("")
    const [userError, setUserError] = useState("")

    useEffect(() => {
        const data = localStorage.getItem("user")
        if (data) setAllUsers(JSON.parse(data))
    }, [])  // solo se ejecuta una vez
    const handleMultipleUsers = (newUser) => {
        console.log("Usuario que llego ", newUser)
        if (!nameNewUser.trim()) return

        if (!allUsers.some(u => u.userName === nameNewUser)) {
            console.log("Usuario no existente")
            return
        }
        if (newUser === ownerName) {
            console.log("No te puedes agregar a ti mismo ")
            return
        }

        if (!nameNewUser.trim()) {
            setUserError("Escribe un nombre de usuario");
            return;
        }

        if (sharedUsers.includes(newUser)) {
            setUserError("Ese usuario ya está agregado");
            return;
        }
        setSharedUsers(prev => [...prev, newUser])
        console.log("limpiar")
        setNameNewUser("")
        setUserError("");
    }

    const handleDeleteUser = (user) => {
        setSharedUsers(prev => prev.filter(u => u !== user))
    }

    const handleSubmit = () => {

        if (!nameProject.trim()) {
        setError("El nombre del proyecto es obligatorio");
        return;
    }

    setError("");

    const sharedUserIds = sharedUsers.map(name =>
        allUsers.find(u => u.userName === name)?.id
    ).filter(Boolean)

    const newProject = {
        idProject: crypto.randomUUID(),
        nameProject: nameProject,
        tasks: [{
            idTask: crypto.randomUUID(),
            nameTask: "New Task",
            description: "Desc",
            deadLine: new Date().toISOString().split("T")[0],
            status: "PENDING",
            priority: "HIGH",
            usersAsigned: [],
        }],
        sharedUsers: sharedUserIds
    }

    onCreateProject(newProject)
    onClose()

    setNameProject("")
    setSharedUsers([])
    }


    console.log(sharedUsers)
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Nuevo proyecto</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <input
                        placeholder="Título"
                        value={nameProject}
                        onChange={(e) => setNameProject(e.target.value)}
                    />

                    {error && <Text color="red.500">{error}</Text>}


                    <Flex>
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={nameNewUser}
                            onChange={e => setNameNewUser(e.target.value)}
                        />
                        <Button onClick={() => handleMultipleUsers(nameNewUser)}>
                            Agregar usuario
                        </Button>

                        {userError && <Text color="red.500">{userError}</Text>}

                    </Flex>
                    <Text>Usuarios compartidos</Text>
                    {(sharedUsers ?? []).map(user => (
                        <div key={user}>
                            <ButtonIcon
                                icon={<AppIcon name="LuX" />}
                                label="Borrar proyecto"
                                onClick={() => handleDeleteUser(user)}
                            />
                            <Tag >

                                {user}</Tag>
                        </div>

                    ))}


                    <Button onClick={handleSubmit}>
                        Crear tarea
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalProject
