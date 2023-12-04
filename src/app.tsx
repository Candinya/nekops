import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Router from "@/router.tsx";
import Header from "@/components/header.tsx";
import Nav from "@/components/nav.tsx";
import Footer from "@/components/footer.tsx";
import NotificationCenter from "@/components/notificationCenter.tsx";

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
      padding="md"
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

      <AppShell.Main>
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