import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Select // Importamos Select de Chakra para que se vea bien
} from "@chakra-ui/react"
import { Flex } from "@chakra-ui/react"
import { useState } from 'react'
import { Button } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
function ModalTask({ isOpen, onClose, onCreateTask, usersShared, ownerName, allUsers }) {
    const [nameTask, setNameTask] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [priority, setPriority] = useState("low")
    const [assignedUsers, setAssignedUsers] = useState([])
    const [userInput, setUserInput] = useState("")
    console.log("Usuarios para asignar: ", usersShared)
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
        onClose()
        setNameTask("")
        setDescription("")
        setDueDate("")
        setPriority("low")
        setAssignedUsers([])
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
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
    )
}

export default ModalTask