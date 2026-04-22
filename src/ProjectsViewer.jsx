import SideBar from "./components/SideBar"
import { Link } from "react-router-dom"
import { Button } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import ModalProject from "./components/ModalProject"
export default function ProjectsViewer() {

    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            setUsers(JSON.parse(data));
        }
    }, []);
    const drawer = useDisclosure()
    const modal = useDisclosure();
    const projectBase = {
        id: 1,
        userName: "New User",
        profilePhoto: null, // This can be null is user not upload photo and will passed as base64
        password: "DefaultPassword",
        projects: [
            // Project base
            {
                idProject: 1,
                nameProject: "New Project",
                tasks: [{
                    idTask: crypto.randomUUID(),
                    nameTask: "New Task",
                    description: "Desc",
                    deadLine: "date",
                    status: "PENDING"
                }]
            }
        ]
    }
    const handleNewProjects = (newProject) => {
        setUsers(prev => {
            const updated = prev.map(user => ({
                ...user,
                projects: [...user.projects, newProject]  // agrega el proyecto al usuario
            }));
            localStorage.setItem("user", JSON.stringify(updated));  // persiste
            return updated;
        });
    };



    return (
        <>

            {users.map(user => (


                <div key={user.id}>
                    <h2>{user.userName}</h2>

                    {user.projects.map(project => (
                        <div key={project.idProject}>
                            <h3>{project.nameProject}</h3>
                            <Link to={`/dashboard/${project.idProject}`} >
                                <Button className="enterProject"
                                    bg="#c7c3ff"
                                    _hover={{ bg: "#7b789b" }}
                                    _active={{ bg: "#47455c" }}
                                    _focus={{ boxShadow: "0 0 0 2px #c7c3ff" }}
                                >Go</Button>
                            </Link>
                            {project.tasks.map(task => (
                                <p key={task.idTask}>
                                    {task.nameTask} - {task.status}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            ))}

            <Button onClick={modal.onOpen}>
                New project

                <ModalProject
                    isOpen={modal.isOpen}
                    onClose={modal.onClose}
                    onCreateProject={handleNewProjects}

                />
            </Button>

            <Button colorScheme='blue' onClick={drawer.onOpen}>
                Drawer

            </Button>
            <SideBar
                isOpen={drawer.isOpen}
                onClose={drawer.onClose}
            />

        </>
    )
}