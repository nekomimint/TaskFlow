import { Link } from "react-router-dom"
import ButtonIcon from "../ButtonIcon"
import AppIcon from "../AppIcon"
import EditProjects from "./EditProjects"
import DeleteProject from "./DeleteProjects"
import { Text } from "@chakra-ui/react"
import "./singleProject.css"
export default function SingleProject({ project, userId, ownerName, allData, onUpdateProject, onDeleteProject }) {
    return (
        <div className="projectCard">
            <Text fontSize='3xl' textAlign={'left'}>{project.nameProject}</Text>
            <Text fontSize={'lg'}>Acciones:</Text>
            <div className="contextButtonActions">
                <Link to={`/dashboard/${userId}/${project.idProject}`}>
                    <ButtonIcon
                        icon={<AppIcon name="LuDoorOpen" />}
                        label="Entrar al proyecto"
                    />
                </Link>
                <EditProjects
                    ownerName={ownerName}
                    onUpdateProject={onUpdateProject}
                    projectData={project}
                    allData={allData}
                />
                <DeleteProject
                    onDelete={onDeleteProject}
                    idProject={project.idProject}
                />
            </div>
        </div>
    )
}