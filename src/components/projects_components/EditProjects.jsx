import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton
} from "@chakra-ui/react"
import { useState } from 'react'
function EditProjects({ isOpen, onClose, onEditProject }) {
    const [nameProject, setNameProject] = useState("")

    const [sharedUsers, setSharedUsers] = useState([])
    const [dataProject, setDataProject] = useState([])
    const handleSubmit = () => {
        const dataUpdated = {
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
        onEditProject(dataUpdated)
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
                        Guardar
                    </button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default EditProjects
