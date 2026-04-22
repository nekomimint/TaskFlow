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


export default function Tasks({ id, title, descripcion, status }) {
    const { ref, listeners, attributes } = useDraggable({
        id: id,
    });

    function handleDelete() {

    }
    return (
        <div ref={ref}  {...attributes}>
            <AccordionItem className="accordionStyle" >
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
                                onClick={handleDelete}
                            />
                        </div>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </div>
    )
}