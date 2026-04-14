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
import { div } from 'framer-motion/client';
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import AppIcon from "./AppIcon"
import './Tasks.css'
export default function Tasks({ id, title, descripcion, status }) {
    const { ref, listeners, attributes } = useDraggable({
        id: id,
    });
    return (
        <div ref={ref}  {...attributes}>
            <AccordionItem {...listeners}>
                <h2>
                    <div className="buttonHeader">
                        <AppIcon name="LuGrip" {...listeners} {...attributes} />
                        <AccordionButton>
                            <Box as='span' flex='1' textAlign='left'>
                                {title}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </div>

                </h2>
                <AccordionPanel >
                    {descripcion}
                </AccordionPanel>
            </AccordionItem>
        </div>
    )
}