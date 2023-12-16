import HomePage from "@/pages/home.tsx";
import SSHPage from "@/pages/ssh.tsx";
import MultirunPage from "@/pages/multirun.tsx";
import RescuePage from "@/pages/rescue.tsx";
import ServersPage from "@/pages/servers.tsx";
import SnippetsPage from "@/pages/snippets.tsx";
import Settings from "@/pages/settings.tsx";

import {
  IconCirclesRelation,
  IconCodeAsterix,
  IconHeartbeat,
  IconHome,
  IconLibrary,
  IconServerCog,
  IconSettings,
  IconStars,
  IconTerminal2,
} from "@tabler/icons-react";

export const routes = [
  {
    path: "/",
    page: HomePage,
  },
  {
    path: "/ssh",
    page: SSHPage,
  },
  {
    path: "/multirun",
    page: MultirunPage,
  },
  {
    path: "/rescue",
    page: RescuePage,
  },
  {
    path: "/servers",
    page: ServersPage,
  },
  {
    path: "/snippets",
    page: SnippetsPage,
  },
  {
    path: "/settings",
    page: Settings,
  },
];

export const navs = [
  {
    label: "Home",
    icon: IconHome,
    path: "/",
  },
  {
    label: "Connect",
    icon: IconCirclesRelation,
    path: "#/connect",
    subs: [
      {
        label: "SSH",
        icon: IconTerminal2,
        path: "/ssh",
      },
      {
        label: "Multirun",
        icon: IconStars,
        path: "/multirun",
      },
      {
        label: "Rescue",
        icon: IconHeartbeat,
        path: "/rescue",
      },
    ],
  },
  {
    label: "Library",
    icon: IconLibrary,
    path: "#/library",
    subs: [
      {
        label: "Servers",
        icon: IconServerCog,
        path: "/servers",
      },
      {
        label: "Snippets",
        icon: IconCodeAsterix,
        path: "/snippets",
      },
    ],
  },
  {
    label: "Settings",
    icon: IconSettings,
    path: "/settings",
  },
];
