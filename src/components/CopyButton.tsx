// Fork from https://github.com/mantinedev/mantine/blob/master/packages/@mantine/core/src/components/CopyButton/CopyButton.tsx
// Use tauri clipboard API here

import { ReactNode, useState } from "react";
import { useProps } from "@mantine/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

interface CopyButtonProps {
  /** Children callback, provides current status and copy function as an argument */
  children: (payload: { copied: boolean; copy: () => void }) => ReactNode;

  /** Value that will be copied to the clipboard when the button is clicked */
  value: string;

  /** Copied status timeout in ms, `1000` by default */
  timeout?: number;
}

const defaultProps: Partial<CopyButtonProps> = {
  timeout: 1000,
};

const CopyButton = (props: CopyButtonProps) => {
  const { children, timeout, value, ...others } = useProps(
    "CopyButton",
    defaultProps,
    props,
  );
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, timeout);
  };
  return <>{children({ copy, copied, ...others })}</>;
};

export default CopyButton;