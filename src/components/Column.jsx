import { ChakraProvider } from "@chakra-ui/react";
import { Accordion, Flex, Stack } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/react';
import './Column.css'
import Tasks from "./Tasks"
<<<<<<< HEAD
export default function Column({ column, tasks, onEditTask }) {
=======
export default function Column({ column, tasks, }) {
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
    // console.log(column.id, tasks)
    const { ref } = useDroppable({
        id: column.id,
    });
<<<<<<< HEAD

=======
    console.log(event);
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82

    return (
        <div className="columnContainer"
            ref={ref}
            style={{
                minHeight: "200px",   // Need a minimun height for the tasks recognize a valid space
                width: "100%",
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
<<<<<<< HEAD
                            status={tarea.status}
                            onEditTask={onEditTask}
                            
=======
>>>>>>> cdc6444f6c551d0398864191a90c052d4c711b82
                        />
                    })}

                </Accordion>
            </Stack>
        </div>
    )
}