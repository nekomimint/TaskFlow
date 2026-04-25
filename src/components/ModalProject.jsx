import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton
} from "@chakra-ui/react"
import { useState } from 'react'
function ModalProject({ isOpen, onClose, onCreateProject }) {
    const [nameProject, setNameProject] = useState("")

    const handleSubmit = () => {
        const newProject = {
            idProject: crypto.randomUUID(),
            nameProject: nameProject,
            tasks: [{
                idTask: crypto.randomUUID(),
                nameTask: "New Task",
                description: "I'm a new task generated via new project!!!",
                deadLine: "2026",
                status: "PENDING"
            }]
        }
        onCreateProject(newProject)
        onClose()

        // limpiar inputs
        setNameProject("")
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
                        value={nameProject}
                        onChange={(e) => setNameProject(e.target.value)}
                    />

                    <button onClick={handleSubmit}>
                        Crear tarea
                    </button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalProject
