import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure
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
function EditProjects({ isOpen, onClose, onUpdateProject, ownerName, projectData, allData }) {

    console.log("Project data: ", projectData)
    const [allUsers, setAllUsers] = useState(allData)
    const [nameProject, setNameProject] = useState(projectData.nameProject)
    const [sharedUsers, setSharedUsers] = useState(
        projectData?.sharedUsers?.map(id =>
            allUsers.find(u => u.id === id)?.userName
        ).filter(Boolean) ?? []
    )
    const [nameNewUser, setNameNewUser] = useState([]);


    const modal = useDisclosure();
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
        console.log("limpiar")
        setNameNewUser("")
    }

    const handleDeleteUser = (user) => {
        setSharedUsers(prev => prev.filter(u => u !== user))
    }


    const handleSubmit = () => {
        const sharedUserIds = sharedUsers.map(name =>
            allUsers.find(u => u.userName === name)?.id
        ).filter(Boolean)

        const updatedProject = {
            ...projectData,          //  copia todo el proyecto original
            nameProject,         // sobreescribe solo el nombre
            sharedUsers: sharedUserIds  // sobreescribe solo los usuarios
            // las tasks se conservan con el ...project
        }

        onUpdateProject(updatedProject)
        modal.onClose()
        setNameProject("")
    }

    console.log(sharedUsers)
    return (

        <>
            <ButtonIcon
                icon={<AppIcon name="LuPencilLine" />}
                label="Modificar proyecto"
                onClick={modal.onOpen}
            />

            <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
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
                                value={nameNewUser}
                                onChange={e => setNameNewUser(e.target.value)}
                            />
                            <Button onClick={() => handleMultipleUsers(nameNewUser)}>
                                Agregar usuario
                            </Button>
                        </Flex>
                        <Text>Usuarios compartidos</Text>
                        {(sharedUsers).map(user => (
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
        </>
    )
}

export default EditProjects
