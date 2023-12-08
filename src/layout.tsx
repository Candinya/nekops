import "@mantine/core/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";

import App from "@/app.tsx";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const Layout = () => (
  <MantineProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>
);

export default Layout;
