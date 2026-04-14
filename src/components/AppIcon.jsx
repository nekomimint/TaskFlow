import { Icon } from '@chakra-ui/react'
import { LuGrip, } from "react-icons/lu";

const iconMap = {
    LuGrip,
    // agrega los que necesites...
};

export default function AppIcon({ name, ...props }) {
    const IconComponent = iconMap[name];

    if (!IconComponent) return null;

    return <Icon as={IconComponent} {...props} />
}