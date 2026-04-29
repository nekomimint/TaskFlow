import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Select // Importamos Select de Chakra para que se vea bien
} from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"

import { useState } from 'react'

function ModalTask({ isOpen, onClose, onCreateTask }) {
    const [nameTask, setNameTask] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [priority, setPriority] = useState("low") // NUEVO: Estado para la prioridad (baja por defecto)
    const [error, setError] = useState("")
    
    const handleSubmit = () => {
        if (!nameTask.trim() || !description.trim()) {
            setError("El título y la descripción son obligatorios");
            return;
        }
       
        const newTask = {
            idTask: crypto.randomUUID(),
            nameTask,
            description,
            deadLine: dueDate,
            status: "PENDING",
            priority: priority // NUEVO: Se incluye la prioridad en el objeto de la tarea
        }

        onCreateTask(newTask)
        onClose()

        // limpiar inputs
        setNameTask("")
        setDescription("")
        setDueDate("")
        setPriority("low") // NUEVO: Limpiamos también la prioridad
        setError("")
    }

    

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Nueva tarea</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {error && <Text color="red.500">{error}</Text>}
                    <input
                        placeholder="Título"
                        value={nameTask}
                        onChange={(e) => setNameTask(e.target.value)}
                    />

                    {error && <Text color="red.500">{error}</Text>}
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

                    <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
                        Crear tarea
                    </button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalTask