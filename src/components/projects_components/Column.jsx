import { ChakraProvider } from "@chakra-ui/react";
import { Accordion, Flex, Stack } from '@chakra-ui/react'
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Box } from "@chakra-ui/react";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Text } from "@chakra-ui/react";
import { CSS } from '@dnd-kit/utilities';
import './Column.css'
import Tasks from "./Tasks"
import { useColorModeValue } from "@chakra-ui/react";
import TaskEdit from "../tasks/TaskEdit";
import AppIcon from "../AppIcon";
export default function Column({ column, tasks, onEditTask, onDeleteTask }) {
    const { setNodeRef } = useDroppable({ id: column.id });
    const { attributes, listeners: dragListeners, setNodeRef: dragRef, transform } = useDraggable({
        id: column.id,
        data: { type: "column" }  // ✅
    });
    const style = {
        transform: CSS.Translate.toString(transform),
        touchAction: "none",  // ✅ importante para touch
    }
    return (
        <div className="columnContainer"
            ref={setNodeRef} style={style}>
            <Stack direction='column' className="taskBoard">

                <Flex align="center" >
                    <div className="spacer"></div>
                    <Box
                        ref={dragRef} {...dragListeners}
                        style={{ cursor: "grab" }}
                        display={'flex'} flexDir={'row'}
                        className="headerColumn">
                        <AppIcon name="LuGrip" />
                        <Text fontSize='xl' textAlign={'center'}>{column.title}</Text>
                        <div className="spacer"></div>
                    </Box>


                </Flex>
                <SortableContext
                    items={tasks.map(t => t.idTask)}
                    strategy={verticalListSortingStrategy}
                >
                    <Accordion allowMultiple className="spaceTasks">
                        {tasks.map(tarea => {
                            return <Tasks
                                key={tarea.idTask}
                                id={tarea.idTask}
                                title={tarea.nameTask}
                                descripcion={tarea.description}
                                status={tarea.status}
                                dueDate={tarea.deadLine}
                                priority={tarea.priority}
                                onEditTask={onEditTask}
                                onDeleteTask={onDeleteTask}
                                dataTask={tarea}
                            />
                        })}
                    </Accordion>
                </SortableContext>
            </Stack>
        </div>
    )
}