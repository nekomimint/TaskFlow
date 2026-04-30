import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Flex,
    useColorModeValue,
    Tag
} from '@chakra-ui/react'
import { useEffect } from 'react';
import { useDraggable } from '@dnd-kit/react';
import AppIcon from '../AppIcon';
import ButtonIcon from '../ButtonIcon';
import './Tasks.css'
import { Text } from '@chakra-ui/react';
// Iconos
import { LuTrash2, LuPencilLine } from "react-icons/lu"
import TaskEdit from '../tasks/TaskEdit';
// Aquí definimos los colores para que se vea rápido qué tan urgente es cada tarea
// Usamos los mismos que acordamos: Rojo (alta), Naranja (media) y Verde (baja)
const priorityColors = {
    high: "#E53E3E",
    medium: "#DD6B20",
    low: "#38A169"
};

// Le pasamos 'priority' como prop para que la tarjeta sepa de qué color pintarse
export default function Tasks({ id, title, descripcion, dueDate, status, priority, onEditTask, onDeleteTask, dataTask }) {

    const { ref, listeners, attributes } = useDraggable({
        id: id,
        type: "task"
    });

    // Función para borrar la tarea con un mensaje de confirmación para no regarla
    function handleDelete() {
        const confirmDelete = confirm("¿De verdad quieres borrar esta tarea?");
        if (!confirmDelete) return;
        onDeleteTask(id);
    }

    // El clásico prompt para editar rápido el título y la descripción
    function handleEdit() {
        const newTitle = prompt("Escribe el nuevo título:", title);
        if (!newTitle) return;

        const newDesc = prompt("¿Cambió la descripción?", descripcion);
        if (!newDesc) return;

        onEditTask(id, newTitle, newDesc);
    }

    // Colores automáticos por si el usuario cambia a modo oscuro o claro
    const taskBg = useColorModeValue("gray.100", "gray.700");
    const taskText = useColorModeValue("black", "white");

    // console.log("dueDate:", dataTask.deadLine);
    // console.log("Nombre tarea: ", dataTask.nameTask)
    // console.log(dataTask.usersAsigned)
    return (
        <div ref={ref} {...attributes}>
            <AccordionItem
                className="accordionStyle"
                style={{
                    backgroundColor: taskBg,
                    color: taskText,
                    borderRadius: "8px",
                    marginBottom: "10px",
                    // Esta es la parte visual clave: le ponemos una franja de color a la izquierda 
                    // según la prioridad elegida en el Modal
                    borderLeft: `8px solid ${priorityColors[priority] || "#CBD5E0"}`
                }}
            >
                <h2>
                    <div className="buttonHeader">
                        {/* El icono para arrastrar la tarea (el grip) */}
                        <AppIcon name="LuGrip" {...listeners} {...attributes} className="iconStyle" />
                        <AccordionButton>
                            <Box as='span' flex='1' textAlign='left' fontWeight="bold">
                                {title}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </div>
                </h2>
                <AccordionPanel className="accordionInfo">
                    <Flex className="taskInfo" direction="column">
                        <Box mb={3}>
                            {descripcion}
                        </Box>

                        {/* Botones de acción para borrar o editar, pegaditos a la derecha */}
                        <Flex className="optionIcons" justify="flex-end" gap={2}>
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
                            <TaskEdit
                                dataTask={dataTask}
                                onUpdateTask={1}
                            />
                            {dueDate && (
                                <Text>
                                    {new Date(dataTask.deadLine).toLocaleDateString()}
                                </Text>
                            )
                            }
                            {
                                dataTask.usersAsigned.map(sharedUsr => {
                                    return (
                                        <Text key={sharedUsr}>{sharedUsr}</Text>
                                    )

                                })
                            }

                        </Flex>

                    </Flex >
                </AccordionPanel >
            </AccordionItem >
        </div >
    )
}