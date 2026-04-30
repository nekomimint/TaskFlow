import {
    AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useRef } from "react"
import ButtonIcon from "../ButtonIcon"
import AppIcon from "../AppIcon"
import { Button } from "@chakra-ui/react"
export default function DeleteProject({ idProject, onDelete }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()

    return (
        <>
            <ButtonIcon
                icon={<AppIcon name="LuTrash2" />}
                label="Borrar proyecto"
                onClick={onOpen}
            />

            <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Eliminar proyecto</AlertDialogHeader>
                        <AlertDialogBody>
                            ¿Estás seguro? Esta acción no se puede deshacer.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={() => {
                                onDelete(idProject)
                                onClose()
                            }}>
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}