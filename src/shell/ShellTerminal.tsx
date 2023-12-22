import { useEffect, useRef } from "react";

import { Terminal } from "xterm";
import { Command } from "@tauri-apps/plugin-shell";

interface ShellTerminalProps {
  nonce: string;
  user: string;
  address: string;
  port: number;
}
const ShellTerminal = ({ nonce, user, address, port }: ShellTerminalProps) => {
  const terminalElementRef = useRef<HTMLDivElement | null>(null);

  const terminateSSH = useRef<(() => Promise<void>) | null>(null);

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

    // Pipe message from ssh to terminal
    const sshCommand = Command.create("ssh", sshArgs);
    sshCommand.on("close", (data) => {
      // Print message
      terminal.write(
        `Process ended ${
          data.code === 0
            ? "\x1B[32msuccessfully\x1B[0m"
            : `with code \x1B[1;31m${data.code}\x1B[0m`
        }.`,
      );

      // Invalidate terminate func
      terminateSSH.current = null;
    });
    sshCommand.on("error", (data) => {
      console.log("error", data);
    });
    sshCommand.stdout.on("data", (data) => {
      terminal.write(data);
      console.log("stdout", data);
    });
    sshCommand.stderr.on("data", (data) => {
      terminal.write(`\x1B[0;31m${data}\x1B[0m`);
    });

    // Start SSH process
    sshCommand.spawn().then((sshProcess) => {
      console.log(sshProcess);

      // Pipe input from terminal to ssh
      terminal.onData((data) => {
        sshProcess.write(data);
      });

      // Terminate when close
      terminateSSH.current = sshProcess.kill;
    });
  };

  // Mount hooks
  useEffect(() => {
    if (terminalElementRef.current) {
      console.log("init", nonce);
      const terminal = new Terminal();

      try {
        terminal.open(terminalElementRef.current);

        if (user && address && port) {
          startSSH(terminal, user, address, port);
        } else {
          terminal.writeln(`Test with nonce \x1B[1;3;31m${nonce}\x1B[0m`);
          terminal.write(" $ ");
        }
      } catch (e) {
        console.error(e);
      }

      return () => {
        // Terminate SSH
        if (terminateSSH.current !== null) {
          terminateSSH.current();
        }

        // Close terminal
        terminal?.dispose();
      };
    }
  }, []);

  return <div ref={terminalElementRef} />;
};

export default ShellTerminal;
