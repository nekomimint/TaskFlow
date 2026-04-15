import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton
} from "@chakra-ui/react"
import { useState } from 'react'
function ModalTask({ isOpen, onClose, onCreateTask, projectId }) {
    const [nameTask, setNameTask] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = () => {
        const newTask = {
            id: crypto.randomUUID(),
            nameTask,
            description,
            status: "PENDING"
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

                    <button onClick={handleSubmit}>
                        Crear tarea
                    </button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalTask
