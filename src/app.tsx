import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Router from "@/router.tsx";
import Header from "@/components/Header.tsx";
import Nav from "@/components/Nav.tsx";
import Footer from "@/components/Footer.tsx";
import NotificationCenter from "@/components/NotificationCenter.tsx";

const App = () => {
  const [isNavOpen, { toggle: toggleNavOpen }] = useDisclosure(true);
  const [
    isNotificationCenterOpen,
    { toggle: toggleNotificationCenterOpen, close: closeNotificationCenter },
  ] = useDisclosure();

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
        <Header
          isNavOpen={isNavOpen}
          toggleNavOpen={toggleNavOpen}
          isNotificationCenterOpen={isNotificationCenterOpen}
          toggleNotificationCenterOpen={toggleNotificationCenterOpen}
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <Nav />
      </AppShell.Navbar>

      <AppShell.Main h={"100dvh"}>
        <Router />

        <NotificationCenter
          isNotificationCenterOpen={isNotificationCenterOpen}
          closeNotificationCenter={closeNotificationCenter}
        />
      </AppShell.Main>

      <AppShell.Footer p="xs">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default App;
