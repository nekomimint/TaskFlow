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
import EditProjects from "./components/projects_components/EditProjects"
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
            const updated = prev.map(user => {
                // Al dueño le agrega el proyecto
                if (user.id === userId) {
                    return { ...user, projects: [...user.projects, newProject] }
                }
                // A los invitados les agrega la referencia
                if (newProject.sharedUsers?.includes(user.id)) {
                    return {
                        ...user,
                        sharedProjects: [
                            ...(user.sharedProjects ?? []),
                            {
                                idProject: newProject.idProject,
                                ownerId: userId,  // quién es el dueño
                                tasksAssigned: []
                            }
                        ]
                    }
                }
                // A los demás los deja igual
                return user
            });
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });

        setCurrentUser(prev => ({
            ...prev,
            projects: [...prev.projects, newProject]
        }))
    };

    const handleEditProject = () => {

    }



    // console.log("profilePhoto:", currentUser?.profilePhoto)
    console.log("Datos actuale", currentUser)
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

            {/* Aqui van los proyectos propios */}

            {currentUser && (
                <div key={currentUser.id} className="projectsContainer">
                    <h2>{currentUser.userName}</h2>

                    {currentUser.projects.map(project => (
                        <div key={project.idProject} className="projectCard">
                            <h3>{project.nameProject}</h3>
                            <Link to={`/dashboard/${userId}/${project.idProject}`}>
                                <Button>Go</Button>
                            </Link>

                            <EditProjects
                                handleEditProject={handleEditProject}
                                actualProjectData={project}
                            />

                            <ButtonIcon
                                icon={<AppIcon name={"LuTrash2"} />}
                                label="Borrar proyecto."
                                onClick={() => handleDeleteProject(project.idProject)}
                            />

                        </div>
                    ))}
                </div>
            )}

            {/* Aqui va lo que es sharedProjects */}
            <h2>Compartidos conmigo</h2>
            {currentUser && currentUser.sharedProjects?.map(shared => {
                console.log("Users actualmente ", users)
                console.log("Compartido actualmente ", shared)
                // Busca al dueño directamente por ownerId
                console.log("shared:", shared)
                console.log("ownerId:", shared.ownerId)
                console.log("users:", users)
                const owner = users.find(u => u.id === shared.ownerId)
                console.log("owner:", owner)
                const project = owner?.projects.find(p => p.idProject === shared.idProject)
                console.log("Proyectos encontrados: ", project)
                if (!project) return null

                return (
                    <div key={shared.idProject} className="projectCard">
                        <h3>{project.nameProject}</h3>
                        <p>De: {owner.userName}</p>
                        <Link to={`/dashboard/${userId}/${project.idProject}`}>
                            <Button>Go</Button>
                        </Link>
                    </div>
                )
            })}

            <Button onClick={modal.onOpen}>
                New project

                <ModalProject
                    isOpen={modal.isOpen}
                    onClose={modal.onClose}
                    onCreateProject={handleNewProjects}
                    ownerName={currentUser && currentUser.userName}
                />
            </Button>




        </div>
    )
}