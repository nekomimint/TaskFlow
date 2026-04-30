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
import DeleteProject from "./components/projects_components/DeleteProjects"

export default function ProjectsViewer() {
    const { userId } = useParams();
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [currentUser, setCurrentUser] = useState();

    // Función separada para cargar el usuario desde localStorage
    const loadUserFromStorage = () => {
        const data = localStorage.getItem('user');
        if (data) {
            const dataParsed = JSON.parse(data);
            setUsers(dataParsed);
            const actualUser = dataParsed.find(user => user.id === userId);
            setCurrentUser(actualUser);
            console.log("4. foundUser:", actualUser)
        }
    };

    useEffect(() => {
        loadUserFromStorage();

        // ✅ RF23 - Escuchar evento cuando SideBar borra datos en la misma pestaña
        window.addEventListener("localStorageUpdated", loadUserFromStorage);
        // ✅ Escuchar cambios desde otras pestañas
        window.addEventListener("storage", loadUserFromStorage);

        return () => {
            window.removeEventListener("localStorageUpdated", loadUserFromStorage);
            window.removeEventListener("storage", loadUserFromStorage);
        };
    }, [userId])

    const drawer = useDisclosure()
    const modal = useDisclosure();

    const handleNewProjects = (newProject) => {
        setUsers(prev => {
            const updated = prev.map(user => {
                if (user.id === userId) {
                    return { ...user, projects: [...user.projects, newProject] }
                }
                if (newProject.sharedUsers?.includes(user.id)) {
                    return {
                        ...user,
                        sharedProjects: [
                            ...(user.sharedProjects ?? []),
                            {
                                idProject: newProject.idProject,
                                ownerId: userId,
                                tasksAssigned: []
                            }
                        ]
                    }
                }
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

    const handleDeleteProject = (idProject) => {
        setUsers(prev => {
            const updated = prev.map(user => {
                if (user.id === userId) {
                    return { ...user, projects: user.projects.filter(p => p.idProject !== idProject) }
                }
                return {
                    ...user,
                    sharedProjects: user.sharedProjects?.filter(
                        sp => sp.idProject !== idProject
                    ) ?? []
                }
            });
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });

        setCurrentUser(prev => ({
            ...prev,
            projects: prev.projects.filter(p => p.idProject !== idProject)
        }))
    }
    const handleEditProject = (updatedProject) => {
        const originalProject = currentUser.projects.find(
            p => p.idProject === updatedProject.idProject
        )
        const oldSharedUsers = originalProject?.sharedUsers ?? []
        const newSharedUsers = updatedProject.sharedUsers ?? []

        // Usuarios que se agregaron
        const added = newSharedUsers.filter(id => !oldSharedUsers.includes(id))
        // Usuarios que se quitaron
        const removed = oldSharedUsers.filter(id => !newSharedUsers.includes(id))

        setUsers(prev => {
            const updated = prev.map(user => {
                // Al dueño le actualiza el proyecto
                if (user.id === userId) {
                    return {
                        ...user,
                        projects: user.projects.map(p =>
                            p.idProject === updatedProject.idProject ? updatedProject : p
                        )
                    }
                }
                // A los nuevos invitados les agrega la referencia
                if (added.includes(user.id)) {
                    return {
                        ...user,
                        sharedProjects: [
                            ...(user.sharedProjects ?? []),
                            { idProject: updatedProject.idProject, ownerId: userId, tasksAssigned: [] }
                        ]
                    }
                }
                // A los que se quitaron les elimina la referencia
                if (removed.includes(user.id)) {
                    return {
                        ...user,
                        sharedProjects: user.sharedProjects?.filter(
                            sp => sp.idProject !== updatedProject.idProject
                        ) ?? []
                    }
                }
                return user
            });
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });

        setCurrentUser(prev => ({
            ...prev,
            projects: prev.projects.map(p =>
                p.idProject === updatedProject.idProject ? updatedProject : p
            )
        }))
    }



    // console.log("profilePhoto:", currentUser?.profilePhoto)

    return (
        <div className="superContainer">
            <div className="upperBar">
                <div className="spacer" />
                <SideBar
                    context={"projects"}
                    userId={userId}
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
                            <Link to={`/dashboard/${userId}/${project.idProject}`}>
                                <Button>Go</Button>
                            </Link>
                            <EditProjects
                                ownerName={currentUser && currentUser.userName}
                                onUpdateProject={handleEditProject}
                                projectData={project}
                                allData={users}
                            />
                            <DeleteProject
                                onDelete={handleDeleteProject}
                                idProject={project.idProject}
                            />
                        </div>
                    ))}
                </div>
            )}

            <h2>Compartidos conmigo</h2>
            {currentUser && currentUser.sharedProjects?.map(shared => {
                const owner = users.find(u => u.id === shared.ownerId)
                const project = owner?.projects.find(p => p.idProject === shared.idProject)
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