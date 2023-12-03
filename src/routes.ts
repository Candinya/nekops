import Home from "@/pages/home";
import SSH from "@/pages/ssh.tsx";
import Multirun from "@/pages/multirun";
import Rescue from "@/pages/rescue";
import Servers from "@/pages/servers";
import Snippets from "@/pages/snippets";
import Settings from "@/pages/settings";

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
    page: Home,
  },
  {
    path: "/ssh",
    page: SSH,
  },
  {
    path: "/multirun",
    page: Multirun,
  },
  {
    path: "/rescue",
    page: Rescue,
  },
  {
    path: "/servers",
    page: Servers,
  },
  {
    path: "/snippets",
    page: Snippets,
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
