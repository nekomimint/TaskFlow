import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { useDraggable } from "@dnd-kit/core";
export default function Tasks({ title, descripcion, status }) {

    return (

        <AccordionItem>
            <h2>
                <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                        {title}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                {descripcion}
            </AccordionPanel>
        </AccordionItem>

    )
}