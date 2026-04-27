import SideBar from "./components/SideBar"
import { Link } from "react-router-dom"
import { Button } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ModalProject from "./components/projects_components/ModalProject"
import { Avatar, AvatarBadge } from "@chakra-ui/react"
import AppIcon from "./components/AppIcon"
import ButtonIcon from "./components/ButtonIcon"
import "./ProjectsViewer.css"
import { Heading } from '@chakra-ui/react'
export default function ProjectsViewer() {
    const { userId } = useParams();
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {


        const data = localStorage.getItem('user');

        if (data) { // SI no esta vacio
            const dataParsed = JSON.parse(data);

            setUsers(dataParsed); // Aqui almacenamos a todos los usuarios por el momento.

            const actualUser = dataParsed.find(user => user.id === userId); //* Aqui vamos comparando los usuarios hasta coincidir con el de su id
            //* Y metemos todo a CurrentUser
            setCurrentUser(actualUser);
            console.log("4. foundUser:", actualUser)

        }

    }, [userId])

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
            const updated = prev.map(user =>
                user.id === userId
                    ? { ...user, projects: [...user.projects, newProject] }
                    : user
            );
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });

        // actualiza currentUser para que la vista reaccione
        setCurrentUser(prev => ({
            ...prev,
            projects: [...prev.projects, newProject]
        }))
    };

    // console.log("profilePhoto:", currentUser?.profilePhoto)

    return (



        <div className="superContainer">

            <div className="upperBar">

                <div className="spacer" />

                <SideBar
                    context={"projects"}
                />

                <Heading>Proyectos</Heading>



                <Avatar
                    src={currentUser?.profilePhoto ?? undefined}
                    size="xl"
                >
                    <AvatarBadge boxSize='1em' bg='#c7c3ff' />
                </Avatar>
            </div>



            {currentUser && (
                <div key={currentUser.id} className="projectsContainer">
                    <h2>{currentUser.userName}</h2>

                    {currentUser.projects.map(project => (
                        <div key={project.idProject} className="projectCard">
                            <h3>{project.nameProject}</h3>
                            <Link to={`/dashboard/${project.idProject}`}>
                                <Button>Go</Button>
                            </Link>
                            <ButtonIcon
                                icon={<AppIcon name={"LuTrash2"} />}
                                label="Borrar proyecto."
                            />
                            <ButtonIcon
                                icon={<AppIcon name={"LuPencilLine"} />}
                                label="Borrar proyecto."
                            />
                        </div>
                    ))}
                </div>
            )}

            <Button onClick={modal.onOpen}>
                New project

                <ModalProject
                    isOpen={modal.isOpen}
                    onClose={modal.onClose}
                    onCreateProject={handleNewProjects}

                />
            </Button>




        </div>
    )
}