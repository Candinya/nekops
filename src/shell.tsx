import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "xterm/css/xterm.css";

import "@/shell/style.css";

import ShellTabs from "@/shell/ShellTabs.tsx";

const theme = createTheme({
  /** Put your mantine theme override here */
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <ShellTabs />
    </MantineProvider>
  </React.StrictMode>,
);
