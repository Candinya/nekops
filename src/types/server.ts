export type BaseInfo = {
  id: string;
  name: string;
  note: string; // Applications etc.
  tags: string[];
  // icon?: string; // TODO
  color: string;
};

export type Provider = {
  provider: {
    provider: string;
    type: "VPS" | "DS";
    product: string;
    price: number; // $/mo
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
  model: "";
};

export type Hardware = {
  hardware: {
    cpu: CPU;
    memory: Memory;
    disk: Disk[];
  };
};

export type NetworkPublic = {
  ipv4: string[];
  ipv6: string[];
};

export type NetworkPrivate = {
  ip: string;
  // groups: string[]; // use BaseInfo.tags
};

export type Network = {
  network: {
    public: NetworkPublic;
    private: NetworkPrivate;
  };
};

export type AccessRegular = {
  // SSH
  port: number;
  user: string;
  private: boolean; // Only allow access from private network
};

export type AccessEmergency = {
  root_password: string;
  method: "VNC" | "IPMI" | "Other";
  address: string;
  username?: string;
  password: string;
};

export type Access = {
  access: {
    regular: AccessRegular;
    emergency: AccessEmergency;
  };
};

export type Server = BaseInfo &
  Provider &
  Location &
  Hardware &
  Network &
  Access;
