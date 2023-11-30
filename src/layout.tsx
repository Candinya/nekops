import "@mantine/core/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "@/app";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const queryClient = new QueryClient();

const Layout = () => (
  <MantineProvider theme={theme}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </MantineProvider>
);

export default Layout;
