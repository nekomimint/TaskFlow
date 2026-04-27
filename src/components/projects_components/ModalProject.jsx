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
function ModalProject({ isOpen, onClose, onCreateProject, ownerName }) {
    const [nameProject, setNameProject] = useState("")

    const [sharedUsers, setSharedUsers] = useState([])
    const [nameNewUser, setNameNewUser] = useState([]);

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        const data = localStorage.getItem("user")
        if (data) setAllUsers(JSON.parse(data))
    }, [])  // solo se ejecuta una vez
    const handleMultipleUsers = (newUser) => {
        console.log("Usuario que llego ", newUser)
        if (!nameNewUser.trim()) return

        if (!allUsers.some(u => u.userName === nameNewUser)) {
            console.log("No existe ese usuario cabron")
            return
        }
        if (newUser === ownerName) {
            console.log("No te puedes agregar a ti mismo webon")
            return
        }

        setSharedUsers(prev => [...prev, newUser])
        setNameNewUser("")  // limpia el input
    }

    const handleDeleteUser = (user) => {
        setSharedUsers(prev => prev.filter(u => u !== user))
    }

    const handleSubmit = () => {
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
                usersAsigned: [], //* Todos los usuarios asignado a la tarea
            }],
            sharedUsers: sharedUsers //* Todas los usuarios que participan en el proyecto, (UUID)

        }
        onCreateProject(newProject)
        onClose()

        // limpiar inputs
        setNameProject("")
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


                    <Flex>
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            onChange={(e) => setNameNewUser(e.target.value)}
                        />
                        <Button onClick={() => handleMultipleUsers(nameNewUser)}>
                            Agregar usuario
                        </Button>
                    </Flex>
                    <Text>Usuarios compartidos</Text>
                    {(sharedUsers ?? []).map(user => (
                        <Text key={user}>{user}</Text>
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
