import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Router from "@/Router.tsx";
import Header from "@/components/Header.tsx";
import Nav from "@/components/Nav";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store.ts";
import { readSettings } from "@/slices/settingsSlice.ts";
import { readServers } from "@/slices/serversSlice.ts";
import { readSnippets } from "@/slices/snippetsSlice.ts";
import { readEncryption } from "@/slices/encryptionSlice.ts";
import AboutModal from "@/components/AboutModal.tsx";
import { emit, listen } from "@tauri-apps/api/event";
import {
  EventNameWindowCloseMain,
  EventNameWindowCloseShell,
} from "@/events/name.ts";
import TerminateAndExitModal from "@/components/TerminateAndExitModal.tsx";
import { Window } from "@tauri-apps/api/window";
import type { Update } from "@tauri-apps/plugin-updater";
import { check } from "@tauri-apps/plugin-updater";
import UpdateModal from "@/components/UpdateModal.tsx";
import { notifications } from "@mantine/notifications";
import {
  CheckFailedNotification,
  LatestVersionNotification,
  LoadingNotification,
} from "@/notifications/update.tsx";
import type { SettingsState } from "@/types/settings.ts";

const App = () => {
  const [isAboutModalOpen, { open: openAboutModal, close: closeAboutModal }] =
    useDisclosure(false);
  const [
    isUpdateModalOpen,
    { open: openUpdateModal, close: closeUpdateModal },
  ] = useDisclosure(false);

  const dispatch = useDispatch<AppDispatch>();

  // Initialize
  useEffect(() => {
    dispatch(readSettings()).then(({ payload: settings }) => {
      dispatch(readServers());
      dispatch(readSnippets());
      dispatch(readEncryption());
      if ((settings as SettingsState).check_update_at_startup) {
        checkUpdate(true);
      }
    });
  }, []);

  // Handle pre-close event
  const [
    isPreCloseModalOpen,
    { open: openPreCloseModal, close: closePreCloseModal },
  ] = useDisclosure(false);

  const mainWindowDoClose = () => {
    // Terminate shells window and then main window
    emit(EventNameWindowCloseShell, true);
    Window.getCurrent().destroy();
  };

  // Listen to pre-close event at page initialize
  useEffect(() => {
    const stopWindowCloseMainPromise = listen<boolean>(
      EventNameWindowCloseMain,
      openPreCloseModal,
    );

    // Stop listen before component (page) destroy
    return () => {
      (async () => {
        (await stopWindowCloseMainPromise)();
      })();
    };
  }, []);

  // Check update
  const [update, setUpdate] = useState<Update | null>(null);
  const checkUpdate = async (silent: boolean = false) => {
    let loadingNotify: string | undefined = undefined;
    if (!silent) {
      loadingNotify = notifications.show(LoadingNotification);
    }

    try {
      const update = await check();
      if (update) {
        setUpdate(update);
        openUpdateModal();
        if (loadingNotify) {
          notifications.hide(loadingNotify);
        }
      } else if (!silent && loadingNotify) {
        notifications.update({
          ...LatestVersionNotification,
          id: loadingNotify,
        });
      }
    } catch (e) {
      console.warn(e);
      notifications.update({
        ...CheckFailedNotification,
        id: loadingNotify,
      });
    }
  };

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

      <AboutModal
        isOpen={isAboutModalOpen}
        close={closeAboutModal}
        checkUpdate={checkUpdate}
      />
      <UpdateModal
        isOpen={isUpdateModalOpen}
        close={closeUpdateModal}
        update={update}
      />
      <TerminateAndExitModal
        isOpen={isPreCloseModalOpen}
        onClose={closePreCloseModal}
        onConfirm={mainWindowDoClose}
      />
    </>
  );
};

export default App;
