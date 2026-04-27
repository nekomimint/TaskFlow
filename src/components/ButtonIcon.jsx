import { IconButton } from "@chakra-ui/react"

export default function ButtonIcon({ icon, label, onClick, ...props }) {
    return (
        <IconButton
            colorScheme='teal'
            aria-label={label}
            size='lg'
            icon={icon}
            onClick={onClick}
            {...props}
        />
    )
}