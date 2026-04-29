import { useState } from "react";
import { Box, Flex, Text, Badge, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const priorityColors = {
    high: "#E53E3E", medium: "#DD6B20", low: "#38A169",
    HIGH: "#E53E3E", MEDIUM: "#DD6B20", LOW: "#38A169",
};

const priorityLabel = {
    high: "Alta", medium: "Media", low: "Baja",
    HIGH: "Alta", MEDIUM: "Media", LOW: "Baja",
};

const statusColors = {
    PENDING: { bg: "#2D3748", label: "Pendiente", color: "#FC8181" },
    DOING:   { bg: "#2C3E2D", label: "En progreso", color: "#68D391" },
    DONE:    { bg: "#1A365D", label: "Terminado",   color: "#63B3ED" },
};

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export default function CalendarView({ tasks = [] }) {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(null);

    const tasksByDay = {};
    tasks.forEach(task => {
        if (!task.deadLine) return;
        const d = new Date(task.deadLine + "T00:00:00");
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
            const day = d.getDate();
            if (!tasksByDay[day]) tasksByDay[day] = [];
            tasksByDay[day].push(task);
        }
    });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
        const dayNum = i - firstDayOfMonth + 1;
        cells.push(dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null);
    }

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
        setSelectedDay(null);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
        setSelectedDay(null);
    };

    const isToday = (day) =>
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    const selectedTasks = selectedDay ? (tasksByDay[selectedDay] || []) : [];

    return (
        <Box
            fontFamily="'Segoe UI', sans-serif"
            bg="gray.900"
            borderRadius="16px"
            p={5}
            maxW="100%"
            mx="auto"
            boxShadow="0 8px 32px rgba(0,0,0,0.5)"
        >
            {/* ── Header navegación ── */}
            <Flex align="center" justify="space-between" mb={5}>
                {/* ✅ FIX: flechas con color visible */}
                <IconButton
                    icon={<LuChevronLeft size={20} />}
                    aria-label="Mes anterior"
                    onClick={prevMonth}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "gray.700", color: "blue.300" }}
                    size="md"
                />
                <Text fontSize="xl" fontWeight="700" color="white" letterSpacing="wide">
                    {MONTHS[currentMonth]} {currentYear}
                </Text>
                <IconButton
                    icon={<LuChevronRight size={20} />}
                    aria-label="Mes siguiente"
                    onClick={nextMonth}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "gray.700", color: "blue.300" }}
                    size="md"
                />
            </Flex>

            {/* ── Encabezados días de semana ── */}
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mb={1}>
                {DAYS_OF_WEEK.map(d => (
                    <Text
                        key={d}
                        textAlign="center"
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.400"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={1}
                    >
                        {d}
                    </Text>
                ))}
            </Box>

            {/* ── Grilla del calendario ── */}
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
                {cells.map((day, idx) => {
                    const dayTasks = day ? (tasksByDay[day] || []) : [];
                    const isSelected = day === selectedDay;
                    const isTodayCell = day ? isToday(day) : false;

                    return (
                        <Box
                            key={idx}
                            // ✅ FIX: altura fija para que no se comprima en meses de 6 semanas
                            h="80px"
                            borderRadius="10px"
                            p={1}
                            cursor={day ? "pointer" : "default"}
                            bg={
                                isSelected ? "blue.700"
                                : isTodayCell ? "blue.900"
                                : day ? "gray.800"
                                : "transparent"
                            }
                            border={isTodayCell ? "2px solid" : "1px solid"}
                            borderColor={
                                isSelected ? "blue.400"
                                : isTodayCell ? "blue.400"
                                : "gray.700"
                            }
                            transition="all 0.15s ease"
                            _hover={day ? { bg: isSelected ? "blue.600" : "gray.700", transform: "scale(1.02)" } : {}}
                            onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                            overflow="hidden"
                        >
                            {day && (
                                <>
                                    <Text
                                        fontSize="xs"
                                        fontWeight={isTodayCell ? "800" : "500"}
                                        color={isTodayCell ? "blue.300" : "gray.300"}
                                        mb={1}
                                        px={1}
                                    >
                                        {day}
                                    </Text>
                                    <Flex flexWrap="wrap" gap="2px" px={1}>
                                        {dayTasks.slice(0, 3).map(task => (
                                            <Box
                                                key={task.idTask}
                                                w="100%"
                                                borderRadius="4px"
                                                px={1}
                                                py="1px"
                                                bg="gray.700"
                                                borderLeft="3px solid"
                                                borderLeftColor={priorityColors[task.priority] || "gray.500"}
                                                overflow="hidden"
                                            >
                                                <Text fontSize="9px" color="gray.200" noOfLines={1} lineHeight="1.4">
                                                    {task.nameTask}
                                                </Text>
                                            </Box>
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <Text fontSize="9px" color="gray.400" px={1}>
                                                +{dayTasks.length - 3} más
                                            </Text>
                                        )}
                                    </Flex>
                                </>
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* ── Panel de detalle al seleccionar un día ── */}
            {selectedDay && (
                <Box mt={4} bg="gray.800" borderRadius="12px" p={4} borderTop="3px solid" borderTopColor="blue.400">
                    <Text fontWeight="700" color="white" mb={3} fontSize="sm">
                        📅 {selectedDay} de {MONTHS[currentMonth]} — {selectedTasks.length} tarea{selectedTasks.length !== 1 ? "s" : ""}
                    </Text>
                    {selectedTasks.length === 0 ? (
                        <Text color="gray.400" fontSize="sm">
                            No hay tareas con fecha límite en este día.
                        </Text>
                    ) : (
                        <Flex flexDirection="column" gap={2}>
                            {selectedTasks.map(task => {
                                const st = statusColors[task.status] || statusColors.PENDING;
                                const prioColor = priorityColors[task.priority] || "#CBD5E0";
                                return (
                                    <Box
                                        key={task.idTask}
                                        bg={st.bg}
                                        borderRadius="8px"
                                        p={3}
                                        borderLeft="4px solid"
                                        borderLeftColor={prioColor}
                                        transition="all 0.15s"
                                        _hover={{ opacity: 0.9 }}
                                    >
                                        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={1}>
                                            <Text fontWeight="600" color="white" fontSize="sm" flex="1">
                                                {task.nameTask}
                                            </Text>
                                            <Flex gap={1} flexShrink={0}>
                                                <Badge fontSize="10px" borderRadius="4px" px={2} bg={prioColor} color="white">
                                                    {priorityLabel[task.priority] || task.priority}
                                                </Badge>
                                                <Badge
                                                    fontSize="10px" borderRadius="4px" px={2}
                                                    color={st.color} bg="transparent"
                                                    border="1px solid" borderColor={st.color}
                                                >
                                                    {st.label}
                                                </Badge>
                                            </Flex>
                                        </Flex>
                                        {task.description && (
                                            <Text color="gray.400" fontSize="xs" mt={1}>
                                                {task.description}
                                            </Text>
                                        )}
                                    </Box>
                                );
                            })}
                        </Flex>
                    )}
                </Box>
            )}

            {/* ── Leyenda ── */}
            <Flex mt={4} gap={4} flexWrap="wrap" justify="flex-end">
                {Object.entries(priorityColors).slice(0, 3).map(([key, color]) => (
                    <Flex key={key} align="center" gap={1}>
                        <Box w="10px" h="10px" borderRadius="2px" bg={color} />
                        <Text fontSize="10px" color="gray.400">
                            Prioridad {priorityLabel[key]}
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
}