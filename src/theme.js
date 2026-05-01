import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const styles = {
  global: (props) => ({
    body: {
      bg: mode("gray.100", "gray.900")(props),
      color: mode("black", "white")(props),
    },
  }),
};

const components = {

  Tabs: {
    baseStyle: (props) => ({
      root: {
        bg: mode("#cecece", "#2b3448")(props),
      },
      tablist: {
        bg: mode("#cecece", "#2b3448")(props),
      },
      tab: {
        _selected: {
          color: mode("black", "white")(props),
          borderBottomColor: mode("black", "white")(props),
        }
      },
      tabpanel: {
        padding: 0,
        margin: 0,
      }
    })
  }
}

const theme = extendTheme({ config, styles, components });
export default theme;