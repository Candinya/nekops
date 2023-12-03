import Home from "@/pages/home";
import Connect from "@/pages/connect";
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
  IconServerCog,
  IconSettings,
  IconStars,
} from "@tabler/icons-react";

export const routes = [
  {
    label: "Home",
    icon: IconHome,
    path: "/",
    page: Home,
  },
  {
    label: "Connect",
    icon: IconCirclesRelation,
    path: "/connect",
    page: Connect,
  },
  {
    label: "Multirun",
    icon: IconStars,
    path: "/multirun",
    page: Multirun,
  },
  {
    label: "Rescue",
    icon: IconHeartbeat,
    path: "/rescue",
    page: Rescue,
  },
  {
    label: "Servers",
    icon: IconServerCog,
    path: "/servers",
    page: Servers,
  },
  {
    label: "Snippets",
    icon: IconCodeAsterix,
    path: "/snippets",
    page: Snippets,
  },
  {
    label: "Settings",
    icon: IconSettings,
    path: "/settings",
    page: Settings,
  },
];

export default routes;
