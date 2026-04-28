import { ChakraProvider } from "@chakra-ui/react";
import { Accordion, Flex, Stack } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/react';
import './Column.css'
import Tasks from "./Tasks"
import { useColorModeValue } from "@chakra-ui/react";
export default function Column({ column, tasks, onEditTask, onDeleteTask }) {
    // console.log(column.id, tasks)
    const { ref } = useDroppable({
        id: column.id,
    });

    const bg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("black", "white");


    return (
        <div className="columnContainer"
            ref={ref}
            style={{
                minHeight: "200px",   // Need a minimun height for the tasks recognize a valid space
                width: "100%",
                backgroundColor: bg,
                color: textColor,
                borderRadius: "10px",
                padding: "10px"
            }}>
            <Stack direction='column' className="taskBoard">
                <h1 >{column.title}</h1>
                <Accordion allowToggle className="spaceTasks">
                    {tasks.map(tarea => {
                        return <Tasks
                            key={tarea.idTask}
                            id={tarea.idTask}
                            title={tarea.nameTask}
                            descripcion={tarea.description}
                            status={tarea.status}
                            priority={tarea.priority}
                            onEditTask={onEditTask}
                            onDeleteTask={onDeleteTask}
                        />
                    })}

                </Accordion>
            </Stack>
        </div>
    )
}