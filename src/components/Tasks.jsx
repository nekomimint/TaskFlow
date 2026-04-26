import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { useDraggable } from '@dnd-kit/react';
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import AppIcon from "./AppIcon"
import './Tasks.css'
import { Flex } from '@chakra-ui/react';
import ButtonIcon from "./ButtonIcon"
// Iconos
import { LuTrash2 } from "react-icons/lu"
import { LuPencilLine } from "react-icons/lu";
import { useColorModeValue } from "@chakra-ui/react";


export default function Tasks({ id, title, descripcion, status, onEditTask, onDeleteTask }) {
    const { ref, listeners, attributes } = useDraggable({
        id: id,
    });

    function handleDelete() {
        const confirmDelete = confirm("¿Eliminar tarea?");
        if (!confirmDelete) return;

        onDeleteTask(id);
    }

    function handleEdit() {
        const newTitle = prompt("Nuevo título:", title);
        if (!newTitle) return;

        const newDesc = prompt("Nueva descripción:", descripcion);
        if (!newDesc) return;

        onEditTask(id, newTitle, newDesc);
    }

    const taskBg = useColorModeValue("gray.100", "gray.700");
    const taskText = useColorModeValue("black", "white");

    return (
        <div ref={ref}  {...attributes}>
            <AccordionItem className="accordionStyle"
            style={{
                backgroundColor: taskBg,
                color: taskText,
                borderRadius: "8px",
                marginBottom: "10px"
            }} >
                <h2>
                    <div className="buttonHeader">
                        <AppIcon name="LuGrip" {...listeners} {...attributes} className="iconStyle" />
                        <AccordionButton>
                            <Box as='span' flex='1' textAlign='left'>
                                {title}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </div>

                </h2>
                <AccordionPanel className="accordionInfo" >
                    <Flex className="taskInfo">
                        {descripcion}
                        <div className="optionIcons">
                            <ButtonIcon
                                icon={<LuTrash2 />}
                                label="Eliminar tarea"
                                onClick={handleDelete}
                            />
                            <ButtonIcon
                                icon={<LuPencilLine />}
                                label="Editar tarea"
                                onClick={handleEdit}
                            />
                        </div>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </div>
    )
}