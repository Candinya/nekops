import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { Command } from "@tauri-apps/plugin-shell";
import { FitAddon } from "@xterm/addon-fit";
import { Window } from "@tauri-apps/api/window";
import type { ShellState } from "@/types/shellState.ts";
import { LoadingOverlay } from "@mantine/core";

interface ShellTerminalProps {
  nonce: string;
  user: string;
  address: string;
  port: number;
  setShellState: (state: ShellState) => void;
  setNewMessage: () => void;
}
const ShellTerminal = ({
  nonce,
  user,
  address,
  port,
  setShellState,
  setNewMessage,
}: ShellTerminalProps) => {
  const terminalElementRef = useRef<HTMLDivElement | null>(null);

  const terminateSSH = useRef<(() => void) | null>(null);

  const [isLoading, setIsLoading] = useState(true);

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

    const stateUpdateOnNewMessage = () => {
      if (isLoading) {
        setIsLoading(false);
        setShellState("active");
      }
      setNewMessage();
    };

    // Pipe message from ssh to terminal
    const sshCommand = Command.create("ssh", sshArgs);
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
      console.log("error", data);
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

      // Pipe input from terminal to ssh // TODO
      terminal.onData((data) => {
        sshProcess.write(data);
      });

      // Terminate when close
      terminateSSH.current = () => {
        sshProcess.kill();
      };
    });
  };

  const invalidAccessInfo = (terminal: Terminal) => {
    setIsLoading(true);
    setShellState("loading");

    let commandBuf = "";
    let isTerminated: boolean = false;

    const prompt = () => {
      terminal.write(" $ ");
    };

    const terminate = () => {
      isTerminated = true;
      terminal.writeln(`Session end`);
      setShellState("terminated");
    };

    const runCommand = () => {
      const commands = commandBuf.trim().split(/\s+/);
      terminal.writeln("");
      if (commands.length > 0 && commands[0]) {
        switch (commands[0]) {
          case "line":
            let lineCount = 100;
            if (commands.length >= 2) {
              lineCount = parseInt(commands[1]);
            }
            for (let i = 0; i < lineCount; i++) {
              terminal.writeln(`Line \x1B[1;3;31m${i + 1}\x1B[0m`);
            }
            break;
          case "close":
            let closeTimeout = 5; // seconds
            if (commands.length >= 2) {
              closeTimeout = parseInt(commands[1]);
            }
            terminal.writeln(`End session in ${closeTimeout} seconds...`);
            // Close
            setTimeout(() => {
              terminate();
            }, closeTimeout * 1000);
            break;
          case "message":
            let messageTimeout = 5;
            if (commands.length >= 2) {
              messageTimeout = parseInt(commands[1]);
            }
            terminal.writeln(`Send message in ${messageTimeout} seconds...`);
            // New Message
            setTimeout(() => {
              terminal.writeln(`New message arrived`);
              setNewMessage();
            }, messageTimeout * 1000);
            break;
          case "help":
            terminal.writeln("Available commands:");
            terminal.writeln("help - Print this help message");
            terminal.writeln(
              "line [count] - Print [count (default 100)] lines of data",
            );
            terminal.writeln(
              "close [timeout] - Close session after [timeout (default 5)] seconds",
            );
            terminal.writeln(
              "message [timeout] - Send message after [timeout (default 5)] seconds",
            );
            break;
          default:
            terminal.writeln(`${commands[0]}: command not found`);
            break;
        }
      }
      prompt();
    };

    // https://github.com/xtermjs/xtermjs.org/blob/master/js/demo.js#L109-L134
    terminal.onData((data) => {
      if (isTerminated) {
        // Do nothing
        return;
      }
      switch (data) {
        case "\u0003": // Ctrl+C
          terminal.writeln("^C");
          prompt();
          break;
        case "\u0004": // Ctrl+D
          terminal.writeln("logout");
          terminate();
          break;
        case "\r": // Enter
          runCommand();
          commandBuf = "";
          break;
        case "\u007F": // Backspace (DEL)
          if (commandBuf.length > 0) {
            terminal.write("\b \b");
            commandBuf = commandBuf.substring(0, commandBuf.length - 1);
          }
          break;
        default:
          if (
            (data >= String.fromCharCode(0x20) &&
              data <= String.fromCharCode(0x7e)) ||
            data >= "\u00a0"
          ) {
            commandBuf += data;
            terminal.write(data);
          }
      }
    });

    // Loading
    setTimeout(() => {
      setIsLoading(false);
      setShellState("active");

      terminal.writeln(`Test with nonce \x1B[1;3;31m${nonce}\x1B[0m`);

      terminal.writeln("");
      terminal.writeln("  _   _      _                   ");
      terminal.writeln(" | \\ | |    | |                  ");
      terminal.writeln(" |  \\| | ___| | _____  _ __  ___ ");
      terminal.writeln(" | . ` |/ _ \\ |/ / _ \\| '_ \\/ __|");
      terminal.writeln(" | |\\  |  __/   < (_) | |_) \\__ \\");
      terminal.writeln(" |_| \\_|\\___|_|\\_\\___/| .__/|___/");
      terminal.writeln("                      | |        ");
      terminal.writeln("                      |_|        ");
      terminal.writeln("");

      terminal.focus();
      prompt();
    }, 3_000);
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

      if (user && address && port) {
        startSSH(terminal, user, address, port);
      } else {
        invalidAccessInfo(terminal);
      }

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
