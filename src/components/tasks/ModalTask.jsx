import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input
} from "@chakra-ui/react"

import { useState } from 'react'
function ModalTask({ isOpen, onClose, onCreateTask }) {
    const [nameTask, setNameTask] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = () => {
        const newTask = {
            idTask: crypto.randomUUID(),
            nameTask,
            description,
            status: "PENDING",
            dueDate: dueDate || null
        }

        onCreateTask(newTask)
        onClose()

        // limpiar inputs
        setNameTask("")
        setDescription("")
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
                    <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        style={{ marginTop: "10px" }}
                    />
                    <button onClick={handleSubmit}>
                        Crear tarea
                    </button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalTask
