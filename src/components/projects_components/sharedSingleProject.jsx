
import { Link } from "react-router-dom"
import ButtonIcon from "../ButtonIcon"
import AppIcon from "../AppIcon"
import "./sharedSingleProject.css"
import { Text } from "@chakra-ui/react"
export default function SharedSingleProject({ shared, users, userId }) {
    const owner = users.find(u => u.id === shared.ownerId)
    const project = owner?.projects.find(p => p.idProject === shared.idProject)

    if (!project) return null

    return (
        <div className="projectCard">
            <Text fontSize='3xl' textAlign={'left'}>{project.nameProject}</Text>
            <Text fontSize={'lg'}>De: {owner.userName}</Text>
            <Text fontSize={'lg'}>Acciones:</Text>
            <Link to={`/dashboard/${userId}/${project.idProject}`}>
                <ButtonIcon
                    icon={<AppIcon name="LuDoorOpen" />}
                    label="Entrar al proyecto"
                />
            </Link>
        </div>
    )
}