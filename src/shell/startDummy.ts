import type { Terminal } from "@xterm/xterm";
import type { ShellState } from "@/types/shellState.ts";

const startDummy = (
  nonce: string,
  terminal: Terminal,
  setIsLoading: (state: boolean) => void,
  setShellState: (state: ShellState) => void,
  setNewMessage: () => void,
) => {
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

    terminal.writeln(`Start with nonce \x1B[1;3;31m${nonce}\x1B[0m`);

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

export default startDummy;
