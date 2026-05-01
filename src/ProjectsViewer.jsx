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
import SingleProject from "./components/projects_components/singleProject"
import SharedSingleProject from "./components/projects_components/sharedSingleProject"
import { Box } from "@chakra-ui/react"
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
            <div className="upperBar" >

                <SideBar
                    context={"projects"}
                    userId={userId}
                />
                <Heading>Proyectos de {currentUser?.userName}</Heading>
                <div className="spacer" />
            </div>

            {currentUser && (
                <div key={currentUser.id} className="projectsContainer">


                    {currentUser.projects.map(project => (
                        <SingleProject
                            key={project.idProject}
                            project={project}
                            userId={userId}
                            ownerName={currentUser.userName}
                            allData={users}
                            onUpdateProject={handleEditProject}
                            onDeleteProject={handleDeleteProject}
                        />
                    ))}
                </div>
            )}

            <Heading>Proyectos compartidos</Heading>
            <div className="sharedContainer">
                {currentUser?.sharedProjects?.map(shared => (
                    <SharedSingleProject
                        key={shared.idProject}
                        shared={shared}
                        users={users}
                        userId={userId}
                    />
                ))}
            </div>

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