import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { Command } from "@tauri-apps/plugin-shell";
import { FitAddon } from "@xterm/addon-fit";
import { Window } from "@tauri-apps/api/window";
import type { ShellState } from "@/types/shellState.ts";
import { LoadingOverlay } from "@mantine/core";
import type { AccessRegular } from "@/types/server.ts";

interface ShellTerminalProps {
  nonce: string;
  server: AccessRegular;
  jumpServer?: AccessRegular;
  setShellState: (state: ShellState) => void;
  setNewMessage: () => void;
}
const ShellTerminal = ({
  nonce,
  server,
  jumpServer,
  setShellState,
  setNewMessage,
}: ShellTerminalProps) => {
  const terminalElementRef = useRef<HTMLDivElement | null>(null);

  const terminateSSH = useRef<(() => void) | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const startSSH = (
    terminal: Terminal,
    server: AccessRegular,
    jumpServer?: AccessRegular,
  ) => {
    const sshArgs = [
      "-tt", // force Pseudo-terminal
    ];
    if (jumpServer) {
      sshArgs.push(
        "-J",
        `${jumpServer.user || "root"}@${jumpServer.address}` +
          (jumpServer.port !== 22 ? `:${jumpServer.port}` : ""),
      );
    }
    if (server.port !== 22) {
      // Is not default SSH port
      sshArgs.push("-p", server.port.toString());
    }
    sshArgs.push(`${server.user || "root"}@${server.address}`);

    console.log("Args", sshArgs.join(" "));

    const stateUpdateOnNewMessage = () => {
      if (isLoading) {
        setIsLoading(false);
        setShellState("active");
      }
      setNewMessage();
    };

    // Pipe message from ssh to terminal
    const sshCommand = Command.create("exec-ssh", sshArgs);
    sshCommand.on("close", (data) => {
      setShellState("terminated");

      // Print message
      terminal.writeln(
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
      // Print error
      terminal.writeln(`Process error: \x1B[1;31m${data}\x1B[0m`);
    });
    sshCommand.stdout.on("data", (data) => {
      stateUpdateOnNewMessage();

      terminal.write(data);
      console.log("stdout", data);
    });
    sshCommand.stderr.on("data", (data) => {
      stateUpdateOnNewMessage();

      terminal.write(`\x1B[0;0;31m${data}\x1B[0m`);
      console.log("stderr", data);
    });

    // Start SSH process
    sshCommand.spawn().then((sshProcess) => {
      console.log(sshProcess);

      // Pipe input from terminal to ssh
      terminal.onData((data) => {
        sshProcess.write(data);
      });

      // Terminate when close
      terminateSSH.current = () => {
        sshProcess.kill();
      };
    });
  };

  // Mount hooks
  useEffect(() => {
    if (terminalElementRef.current) {
      console.log("init", nonce);
      const terminal = new Terminal();
      const fitAddon = new FitAddon();

      // Apply size fit addon
      terminal.loadAddon(fitAddon);
      terminal.open(terminalElementRef.current);
      fitAddon.fit();

      // Hook window resize event
      const currentWindow = Window.getCurrent();
      const stopListenWindowResizeEvent = currentWindow.onResized(() => {
        fitAddon.fit();
      });

      startSSH(terminal, server, jumpServer);

      return () => {
        // Stop window resize listener
        (async () => {
          (await stopListenWindowResizeEvent)();
        })();

        // Terminate SSH
        if (terminateSSH.current !== null) {
          terminateSSH.current();
        }

        // Close terminal
        fitAddon?.dispose();
        terminal?.dispose();
      };
    }
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
      }}
    >
      <div
        ref={terminalElementRef}
        style={{
          height: "100%",
          opacity: isLoading ? 0 : 100,
        }}
      />
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    </div>
  );
};

export default ShellTerminal;
