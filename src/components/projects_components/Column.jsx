import { ChakraProvider } from "@chakra-ui/react";
import { Accordion, Flex, Stack } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/react';
import './Column.css'
import Tasks from "./Tasks"
import { useColorModeValue } from "@chakra-ui/react";
import { useDraggable } from '@dnd-kit/react';

export default function Column({ column, tasks, onEditTask, onDeleteTask }) {
    const { ref } = useDroppable({
        id: column.id,
    });

    const { ref: dragRef, listeners: dragListeners } = useDraggable({
        id: column.id,
        type: "column"
    });
    return (
        <div className="columnContainer"
            ref={ref}
            style={{ minHeight: "200px", width: "100%" }}>
            <Stack direction='column' className="taskBoard">
                {/* ✅ el handle del drag va aquí */}
                <Flex align="center">
                    <span ref={dragRef} {...dragListeners} style={{ cursor: "grab" }}>
                        ☰
                    </span>
                    <h1>{column.title}</h1>
                </Flex>
                <Accordion allowMultiple className="spaceTasks">
                    {tasks.map(tarea => {
                        return <Tasks
                            key={tarea.idTask}
                            id={tarea.idTask}
                            title={tarea.nameTask}
                            descripcion={tarea.description}
                            status={tarea.status}
                            dueDate={tarea.dueDate}
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