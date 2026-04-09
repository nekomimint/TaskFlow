import { ChakraProvider } from "@chakra-ui/react";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import Tasks from "./Tasks"
export default function Column({ column, tasks }) {
    // console.log(column.id, tasks)
    const { setNodeRef } = useDroppable({
        id: column.id,
    });
    return (
        <>
            <h1>{column.title}</h1>
            <Accordion allowMultiple allowToggle>
                {tasks.map(tarea => {
                    return <Tasks
                        key={tarea.id}
                        title={tarea.title}
                        descripcion={tarea.description}
                    />
                })}

            </Accordion>
        </>
    )
}