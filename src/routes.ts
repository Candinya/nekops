import HomePage from "@/pages/Home.tsx";
import SSHPage from "@/pages/SSH.tsx";
import MultirunPage from "@/pages/Multirun.tsx";
import RescuePage from "@/pages/Rescue.tsx";
import ServersPage from "@/pages/Servers.tsx";
import SnippetsPage from "@/pages/Snippets.tsx";
import Settings from "@/pages/Settings.tsx";
import Analysis from "@/pages/Analysis.tsx";

import {
  IconCirclesRelation,
  IconCodeAsterix,
  IconHeartbeat,
  IconHome,
  IconLibrary,
  IconReport,
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
  {
    path: "/analysis",
    page: Analysis,
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
    label: "Analysis",
    icon: IconReport,
    path: "/analysis",
  },
  {
    label: "Settings",
    icon: IconSettings,
    path: "/settings",
  },
];
