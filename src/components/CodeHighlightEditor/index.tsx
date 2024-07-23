import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/themes/prism-tomorrow.css";
import { Input } from "@mantine/core";
import classes from "./styles.module.css";
import "./line-number.css";
import type { KeyboardEventHandler } from "react";

const highlightWithLineNumbers = (input: string) =>
  highlight(input, languages.bash, "bash")
    .split("\n")
    .map((line, i) => `<span class='line-number'>${i + 1}</span>${line}`)
    .join("\n");

interface CodeHighlightEditorProps {
  label?: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement> &
    KeyboardEventHandler<HTMLTextAreaElement>;
}
const CodeHighlightEditor = ({
  label,
  value,
  onChange,
  placeholder,
  onKeyDown,
}: CodeHighlightEditorProps) => (
  <Input.Wrapper label={label || "Code"}>
    <Input
      component={Editor}
      value={value}
      onValueChange={onChange}
      highlight={(code: string) => highlightWithLineNumbers(code)}
      padding={10}
      className="editor"
      classNames={{
        wrapper: classes.wrapper,
        input: classes.input,
      }}
      multiline
      placeholder={placeholder}
      onKeyDown={onKeyDown}
    />
  </Input.Wrapper>
);

export default CodeHighlightEditor;
