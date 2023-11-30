import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Router from "@/router.tsx";
import Header from "@/components/header.tsx";
import Nav from "@/components/nav.tsx";
import Footer from "@/components/footer.tsx";

const App = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 48 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: {
          mobile: !opened,
          desktop: !opened,
        },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Nav />
      </AppShell.Navbar>

      <AppShell.Main>
        <Router />
      </AppShell.Main>

      <AppShell.Footer p="xs">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default App;
