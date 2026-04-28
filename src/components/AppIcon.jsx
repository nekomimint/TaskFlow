import { Icon } from '@chakra-ui/react'
import { LuGrip, } from "react-icons/lu";
import { LuPencilLine } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { LuMoon } from "react-icons/lu";
import { LuSunDim } from "react-icons/lu";
import { LuChevronFirst } from "react-icons/lu";
import { LuChevronLast } from "react-icons/lu";
import { LuX } from "react-icons/lu";
const iconMap = {
    LuGrip,
    LuPencilLine,
    LuTrash2,
    LuMoon,
    LuSunDim,
    LuChevronFirst,
    LuChevronLast,
    LuX,
    // agrega los que necesites...
};

export default function AppIcon({ name, ...props }) {
    const IconComponent = iconMap[name];

    if (!IconComponent) return null;

    return <Icon as={IconComponent} {...props} />
}