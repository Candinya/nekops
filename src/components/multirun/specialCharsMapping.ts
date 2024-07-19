type SpecialCharsInfo = {
  key: string;
  value: string;
  description: string;
};
export const SpecialCharsMapping: SpecialCharsInfo[] = [
  {
    key: "\n",
    value: "\r",
    description: "Enter (new line)",
  },
  {
    key: "#[Ctrl+C]",
    value: "\u0003",
    description: "Ctrl + C, keyboard interruption",
  },
  {
    key: "#[Ctrl+D]",
    value: "\u0004",
    description: "Ctrl + D, disconnect",
  },
  /* Not working for dummy, not sure why
  {
    key: "#[BS]",
    value: "\u0008",
    description: "Backspace",
  },
  */
  {
    key: "#[DEL]",
    value: "\u007F",
    description: "Delete",
  },
];
