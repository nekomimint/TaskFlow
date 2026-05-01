import { useState } from "react";
import { Badge, useColorModeValue } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import "./CalendarView.css";

const priorityColors = {
    high: "#E53E3E", medium: "#DD6B20", low: "#38A169",
    HIGH: "#E53E3E", MEDIUM: "#DD6B20", LOW: "#38A169",
};

const priorityLabel = {
    high: "Alta", medium: "Media", low: "Baja",
    HIGH: "Alta", MEDIUM: "Media", LOW: "Baja",
};

const statusLabel = {
    PENDING: "Pendiente",
    DOING: "En progreso",
    DONE: "Terminado",
};

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function CalendarView({ tasks = [] }) {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(null);

    const calendarBg = useColorModeValue("calendarLight", "calendarDark");

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
        <div className={`calendarContainer ${calendarBg}`}>
            <div className="calendarHeader">
                <button className="calendarNavBtn" onClick={prevMonth}>
                    <LuChevronLeft size={20} />
                </button>
                <span className="calendarTitle">
                    {MONTHS[currentMonth]} {currentYear}
                </span>
                <button className="calendarNavBtn" onClick={nextMonth}>
                    <LuChevronRight size={20} />
                </button>
            </div>

            <div className="calendarWeekDays">
                {DAYS_OF_WEEK.map(d => (
                    <span key={d} className="calendarWeekDay">{d}</span>
                ))}
            </div>

            <div className="calendarGrid">
                {cells.map((day, idx) => {
                    const dayTasks = day ? (tasksByDay[day] || []) : [];
                    const isSelected = day === selectedDay;
                    const isTodayCell = day ? isToday(day) : false;

                    return (
                        <div
                            key={idx}
                            className={`calendarCell 
                                ${!day ? "calendarCellEmpty" : "calendarCellActive"}
                                ${isSelected ? "calendarCellSelected" : ""}
                                ${isTodayCell ? "calendarCellToday" : ""}
                            `}
                            onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                        >
                            {day && (
                                <>
                                    <span className={`calendarDayNumber ${isTodayCell ? "calendarDayToday" : ""}`}>
                                        {day}
                                    </span>
                                    <div className="calendarTaskList">
                                        {dayTasks.slice(0, 3).map(task => (
                                            <div
                                                key={task.idTask}
                                                className="calendarTaskChip"
                                                style={{ borderLeftColor: priorityColors[task.priority] || "#CBD5E0" }}
                                            >
                                                <span className="calendarTaskName">{task.nameTask}</span>
                                            </div>
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <span className="calendarTaskMore">+{dayTasks.length - 3} más</span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div className="calendarDetail">
                    <p className="calendarDetailTitle">
                        {selectedDay} de {MONTHS[currentMonth]} — {selectedTasks.length} tarea{selectedTasks.length !== 1 ? "s" : ""}
                    </p>
                    {selectedTasks.length === 0 ? (
                        <p className="calendarDetailEmpty">No hay tareas con fecha límite en este día.</p>
                    ) : (
                        <div className="calendarDetailList">
                            {selectedTasks.map(task => (
                                <div
                                    key={task.idTask}
                                    className="calendarDetailTask"
                                    style={{ borderLeftColor: priorityColors[task.priority] || "#CBD5E0" }}
                                >
                                    <div className="calendarDetailTaskHeader">
                                        <span className="calendarDetailTaskName">{task.nameTask}</span>
                                        <div className="calendarDetailBadges">
                                            <span
                                                className="calendarBadge"
                                                style={{ background: priorityColors[task.priority] || "#CBD5E0" }}
                                            >
                                                {priorityLabel[task.priority] || task.priority}
                                            </span>
                                            <span className="calendarBadgeOutline">
                                                {statusLabel[task.status] || task.status}
                                            </span>
                                        </div>
                                    </div>
                                    {task.description && (
                                        <p className="calendarDetailDesc">{task.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="calendarLegend">
                {Object.entries(priorityColors).slice(0, 3).map(([key, color]) => (
                    <div key={key} className="calendarLegendItem">
                        <span className="calendarLegendDot" style={{ background: color }} />
                        <span className="calendarLegendLabel">Prioridad {priorityLabel[key]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
