import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Router from "@/Router.tsx";
import Header from "@/components/Header.tsx";
import Nav from "@/components/Nav.tsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store.ts";
import { readSettings } from "@/slices/settingsSlice.ts";
import { readServers } from "@/slices/serversSlice.ts";
import { readSnippets } from "@/slices/snippetsSlice.ts";
import { readEncryption } from "@/slices/encryptionSlice.ts";
import AboutModal from "@/components/AboutModal.tsx";

const App = () => {
  const [isAboutModalOpen, { open: openAboutModal, close: closeAboutModal }] =
    useDisclosure(false);

  const dispatch = useDispatch<AppDispatch>();

  // Initialize
  useEffect(() => {
    dispatch(readSettings()).then(() => {
      dispatch(readServers());
      dispatch(readSnippets());
      dispatch(readEncryption());
    });
  }, []);

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 200,
          breakpoint: 0,
          collapsed: {
            mobile: false,
            desktop: false,
          },
        }}
      >
        <AppShell.Header>
          <Header openAboutModal={openAboutModal} />
        </AppShell.Header>

        <AppShell.Navbar>
          <Nav />
        </AppShell.Navbar>

        <AppShell.Main h={"100dvh"}>
          <Router />
        </AppShell.Main>
      </AppShell>

      <AboutModal isOpen={isAboutModalOpen} close={closeAboutModal} />
    </>
  );
};

export default App;
