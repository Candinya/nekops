export type BaseInfo = {
  id: string;
  name: string;
  comment: string; // Applications etc.
  tags: string[];
  color: string;
};

export type Provider = {
  provider: {
    name: string;
    type: "VPS" | "DS";
    product: string;
    price: number; // $/mo
  };
};

export type Traffic = {
  traffic: {
    limit: number; // TB
    double_rate: boolean;
    bandwidth: number; // Mbps
  };
};

export type Location = {
  location: {
    region: string;
    datacenter: string;
    host_system: string;
  };
};

export type CPU = {
  count: number;
  manufacturer: string;
  model: string;
  core_count: number;
  thread_count: number;
  base_frequency: number; // GHz
};

export type Memory = {
  generation: number;
  ecc: boolean;
  size: number; // GB
  frequency: number; // MHz
};

export type Disk = {
  count: number;
  type: "HDD" | "SSD";
  interface: "SATA" | "SAS" | "NVMe";
  size: number;
  size_unit: "GB" | "TB";
  model: string;
};

export type Hardware = {
  hardware: {
    cpu: CPU;
    memory: Memory;
    disk: Disk[];
  };
};

export type IP = {
  address: string;
  cidr_prefix: number;
  family: "IPv4" | "IPv6";
  comment: string;
  alias: string; // rDNS etc.
};

export type Network = {
  network: {
    public: IP[];
    private: IP[];
  };
};

export type AccessRegular = {
  // SSH
  address: string;
  port: number;
  user: string;
};

export type AccessEmergency = {
  root_password: string;
  method: "VNC" | "IPMI" | "Other";
  address: string;
  username: string;
  password: string; // Method password
  comment: string;
};

export type Access = {
  access: {
    regular: AccessRegular;
    emergency: AccessEmergency;
  };
};

export type Server = BaseInfo &
  Provider &
  Traffic &
  Location &
  Hardware &
  Network &
  Access;

export const defaultDisk: Disk = {
  count: 1,
  type: "SSD",
  interface: "NVMe",
  size: 256,
  size_unit: "GB",
  model: "Generic disk",
};

export const defaultIP: IP = {
  address: "127.0.0.1",
  cidr_prefix: 32,
  family: "IPv4",
  comment: "Change me",
  alias: "",
};

export const defaultServer: Server = {
  id: "",
  name: "",
  comment: "",
  tags: [],
  // icon: "",
  color: "#62b6e7",

  provider: {
    name: "",
    type: "VPS",
    product: "",
    price: 0,
  },

  traffic: {
    limit: 1,
    double_rate: true,
    bandwidth: 1000,
  },

  location: {
    region: "",
    datacenter: "",
    host_system: "",
  },

  hardware: {
    cpu: {
      count: 1,
      manufacturer: "",
      model: "Generic processor",
      core_count: 1,
      thread_count: 1,
      base_frequency: 1,
    },
    memory: {
      generation: 4,
      ecc: false,
      size: 1,
      frequency: 2400,
    },
    disk: [],
  },

  network: {
    public: [],
    private: [],
  },

  access: {
    regular: {
      address: "",
      port: 22,
      user: "",
    },
    emergency: {
      root_password: "",
      method: "VNC",
      address: "",
      username: "",
      password: "",
      comment: "",
    },
  },
};
