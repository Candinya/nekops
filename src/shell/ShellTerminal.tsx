// Forked from https://github.com/robert-harbison/xterm-for-react

import { useEffect, useRef } from "react";

import { Terminal } from "xterm";
import { Command } from "@tauri-apps/plugin-shell";

interface ShellTerminalProps {
  user: string;
  address: string;
  port: number;
}
const ShellTerminal = ({ user, address, port }: ShellTerminalProps) => {
  const terminalElementRef = useRef<HTMLDivElement | null>(null);

  const startSSH = (
    terminal: Terminal,
    user: string,
    address: string,
    port: number,
  ) => {
    const sshArgs = [
      `${user}@${address}`,
      "-tt", // force Pseudo-terminal
    ];
    if (port !== 22) {
      // Is not default SSH port
      sshArgs.push("-p", port.toString());
    }
    const sshProcess = Command.create("ssh", sshArgs);
    sshProcess.on("close", (data) => {
      terminal.write(
        `Process ended ${
          data.code === 0
            ? "\x1B[32msuccessfully\x1B[0m"
            : `with code \x1B[1;31m${data.code}\x1B[0m`
        }.`,
      );
    });
    sshProcess.on("error", (data) => {
      console.log("error", data);
    });
    sshProcess.stdout.on("data", (data) => {
      terminal.write(data);
      console.log("stdout", data);
    });
    sshProcess.stderr.on("data", (data) => {
      terminal.write(`\x1B[0;31m${data}\x1B[0m`);
    });
    sshProcess.spawn().then(console.log);
  };

  // Mount hooks
  useEffect(() => {
    const terminal = new Terminal();

    if (terminalElementRef.current) {
      terminal.open(terminalElementRef.current);
    }

    if (user && address && port) {
      startSSH(terminal, user, address, port);
    } else {
      terminal.writeln("Hello from \x1B[1;3;31mxterm.js\x1B[0m");
      terminal.write(" $ ");
    }

    return () => {
      terminal.dispose();
    };
  }, []);

  return <div ref={terminalElementRef} />;
};

export default ShellTerminal;
