import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton
} from "@chakra-ui/react"
import { useState } from 'react'
import { useDisclosure } from "@chakra-ui/react"
import ButtonIcon from "../ButtonIcon"
import AppIcon from "../AppIcon"
import { Text } from '@chakra-ui/react'
function EditProjects({ onUpdateProject, actualProjectData }) {
    const [nameProject, setNameProject] = useState(actualProjectData.nameProject)
    const [description, setDescription] = useState("")
    const [sharedUsr, setsharedUsr] = useState()
    const modal = useDisclosure();
    const handleSubmit = () => {
        const updateProject = {
            idProject: actualProjectData.idProject,
            nameProject: nameProject,
            tasks: actualProjectData.projects,
            sharedUsers: sharedUsr
        }

        onUpdateProject(updateProject)
        onClose()

        // limpiar inputs
        setNameTask("")
        setDescription("")
    }

    return (
        <>
            <ButtonIcon
                icon={<AppIcon name={"LuPencilLine"} />}
                label="Borrar proyecto."
                onClick={modal.onOpen}
            />
            <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modificar proyecto</ModalHeader>
                    <ModalCloseButton />
                    <Text>
                        Titulo
                    </Text>
                    <ModalBody>
                        <input
                            placeholder="Título"
                            value={nameProject}
                            onChange={(e) => setNameProject(e.target.value)}
                        />
                        <Text>
                            Usuarios compartidos:
                        </Text>
                        {(actualProjectData.sharedUsers ?? []).map(user => (
                            <Text key={user}>{user}</Text>
                        ))}

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EditProjects
