import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Router from "@/router.tsx";
import Header from "@/components/Header.tsx";
import Nav from "@/components/Nav.tsx";
import Footer from "@/components/Footer.tsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { readSettings } from "@/slices/settingsSlice.ts";
import type { AppDispatch } from "@/store.ts";

const App = () => {
  const [isNavOpen, { toggle: toggleNavOpen }] = useDisclosure(true);
  const dispatch = useDispatch<AppDispatch>();

  // Initialize
  useEffect(() => {
    // Read settings
    dispatch(readSettings());
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 48 }}
      navbar={{
        width: 200,
        breakpoint: "xs",
        collapsed: {
          mobile: !isNavOpen,
          desktop: !isNavOpen,
        },
      }}
    >
      <AppShell.Header>
        <Header isNavOpen={isNavOpen} toggleNavOpen={toggleNavOpen} />
      </AppShell.Header>

      <AppShell.Navbar>
        <Nav />
      </AppShell.Navbar>

      <AppShell.Main h={"100dvh"}>
        <Router />
      </AppShell.Main>

      <AppShell.Footer p="xs">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default App;
