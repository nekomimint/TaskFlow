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
    baseStyle: {
      tabpanel: {
        padding: 0,
        margin: 0,
      }
    }
  },
  TabPanel: {
    baseStyle: {
      padding: 0,
      margin: 0,
    }
  },
  Progress: {
    baseStyle: {
      track: {
        borderRadius: "full"
      }
    }
  }
}

const theme = extendTheme({ config, styles, components });
export default theme;