import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Select, // Importamos Select de Chakra para que se vea bien
    useDisclosure
} from "@chakra-ui/react"
import { useEffect } from "react"
import { Flex } from "@chakra-ui/react"
import { useState } from 'react'
import { Button } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import ButtonIcon from "../ButtonIcon"
import AppIcon from "../AppIcon"
function TaskEdit({ onUpdateTask, dataTask }) {
    const [nameTask, setNameTask] = useState(dataTask.nameTask)
    const [description, setDescription] = useState(dataTask.description)
    const [dueDate, setDueDate] = useState(dataTask.deadLine)
    const [priority, setPriority] = useState(dataTask.priority)
    const [assignedUsers, setAssignedUsers] = useState(dataTask.usersAsigned)
    const [userInput, setUserInput] = useState("")
    const modal = useDisclosure()
    const [allUsers, setAllUsers] = useState()

    useEffect(() => {


        const data = localStorage.getItem('user');

        if (data) { // SI no esta vacio
            const dataParsed = JSON.parse(data);

            setAllUsers(dataParsed); // Aqui almacenamos a todos los usuarios por el momento.
            console.log("Toda la data asi de chingaso:", allUsers)

        }

    }, [])
    const ownerName = "xd"
    console.log("Usuarios para asignar: ", dataTask.usersAsigned)
    const handleAddUser = () => {
        if (!userInput.trim()) return






        const foundUser = allUsers?.find(u => u.userName === userInput)
        if (!foundUser) {
            console.log("Usuario no existe")
            return
        }

        // Y aquí ya lo puedes usar
        if (assignedUsers.includes(userInput)) {
            console.log("Ese usuario ya está agregado")
            return
        }

        // Valida que sea dueño o compartido
        const isOwner = userInput === ownerName
        const isShared = usersShared?.includes(foundUser.id)  // compara ids

        if (!isOwner && !isShared) {
            console.log("Usuario no está en el proyecto")
            return
        }

        if (assignedUsers.includes(foundUser.id)) {
            console.log("Usuario ya agregado")
            return
        }
        setAssignedUsers(prev => [...prev, userInput])
        setUserInput("")
    }

    const handleSubmit = () => {
        const newTask = {
            idTask: crypto.randomUUID(),
            nameTask,
            description,
            deadLine: dueDate,
            status: "PENDING",
            priority,
            usersAsigned: assignedUsers
        }
        onCreateTask(newTask)
        modal.onClose()
        setNameTask("")
        setDescription("")
        setDueDate("")
        setPriority("low")
        setAssignedUsers([])
    }

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
                    <ModalHeader>Nueva tarea</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <input
                            placeholder="Título"
                            value={nameTask}
                            onChange={(e) => setNameTask(e.target.value)}
                        />

                        <input
                            placeholder="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            style={{ marginTop: "10px" }}
                        />

                        {/* NUEVO: Menú desplegable para la prioridad */}
                        <label style={{ marginTop: "10px", display: "block" }}>Prioridad:</label>
                        <Select
                            value={priority}

                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </Select>

                        <Flex>
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={userInput}
                                onChange={e => setUserInput(e.target.value)}
                            />
                            <Button onClick={handleAddUser}>Agregar</Button>
                        </Flex>

                        {assignedUsers.map(user => (
                            <Flex key={user}>
                                <Text>{user}</Text>
                                <Button onClick={() => setAssignedUsers(prev => prev.filter(u => u !== user))}>x</Button>
                            </Flex>
                        ))}

                        <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
                            Crear tarea
                        </button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default TaskEdit