import { Icon } from '@chakra-ui/react'
import { LuGrip, } from "react-icons/lu";
import { LuPencilLine } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
const iconMap = {
    LuGrip,
    LuPencilLine,
    LuTrash2,
    // agrega los que necesites...
};

export default function AppIcon({ name, ...props }) {
    const IconComponent = iconMap[name];

    if (!IconComponent) return null;

    return <Icon as={IconComponent} {...props} />
}