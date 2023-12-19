export type Snippet = {
  name: string;
  tags: string[];
  code: string;
};

export const defaultSnippet: Snippet = {
  name: "",
  tags: [],
  code: "",
};
