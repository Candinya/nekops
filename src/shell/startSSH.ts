import { Terminal } from "@xterm/xterm";
import type { AccessRegular } from "@/types/server.ts";
import { Command } from "@tauri-apps/plugin-shell";
import type { ShellState } from "@/types/shellState.ts";

export const startSSH = (
  terminal: Terminal,
  stateUpdateOnNewMessage: () => void,
  setShellState: (newState: ShellState) => void,
  setTerminateSSHFunc: (func: (() => void) | null) => void,
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

  // Pipe message from ssh to terminal
  const sshCommand = Command.create("exec-ssh", sshArgs, {
    encoding: "raw",
  });
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
    setTerminateSSHFunc(null);
  });
  sshCommand.on("error", (data) => {
    // Print error
    terminal.writeln(`Process error: \x1B[1;31m${data}\x1B[0m`);
  });
  sshCommand.stdout.on("data", (data) => {
    stateUpdateOnNewMessage();

    terminal.write(data);
    // console.log("stdout", data);
  });
  sshCommand.stderr.on("data", (data) => {
    stateUpdateOnNewMessage();

    terminal.write("\x1B[0;0;31m"); // Write color control bytes to change output color to red
    terminal.write(data); // Write Uint8Array data in raw mode
    terminal.write("\x1B[0m"); // Write color reset bytes to recover color to default (white)
    // console.log("stderr", data);
  });

  // Start SSH process
  sshCommand.spawn().then((sshProcess) => {
    console.log(sshProcess);

    // Pipe input from terminal to ssh
    terminal.onData((data) => {
      sshProcess.write(data);
    });

    // Terminate when close
    setTerminateSSHFunc(sshProcess.kill);
  });
};
