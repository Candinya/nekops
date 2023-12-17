import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

import App from "@/app.tsx";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const Layout = () => (
  <MantineProvider theme={theme}>
    <BrowserRouter>
      <Notifications zIndex={1001} />
      <App />
    </BrowserRouter>
  </MantineProvider>
);

export default Layout;
