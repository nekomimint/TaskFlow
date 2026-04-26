import { Button } from "@chakra-ui/react"
import { useColorMode } from "@chakra-ui/react"

import ButtonIcon from "../ButtonIcon"
import AppIcon from "../AppIcon"
export default function ChangeTheme() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (

        <>
            <ButtonIcon
                icon={<AppIcon name={colorMode === "light" ? "LuSunDim" : "LuMoon"} />}
                label="Cambiar tema"
                onClick={toggleColorMode}
            />
        </>

    )
}