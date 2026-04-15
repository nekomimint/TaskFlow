import SideBar from "./components/SideBar"
import { Link } from "react-router-dom"
import { Button } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useState, useEffect } from "react"
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