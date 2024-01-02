import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { Snippet } from "@/types/snippet.ts";
import type { RootState } from "@/store.ts";
import { checkParentDir } from "@/slices/common.ts";
import { path } from "@tauri-apps/api";

const SnippetsFileName = "snippets.json";

const noSnippet: Snippet[] = [];

export const readSnippets = createAsyncThunk(
  "snippets/read",
  async (_, { getState }): Promise<Snippet[]> => {
    // read from local file
    const state = getState() as RootState;
    const snippetsIndexFilePath = await path.join(
      state.settings.currentWorkspace.data_dir,
      SnippetsFileName,
    );
    if (await exists(snippetsIndexFilePath)) {
      // Read and parse
      return JSON.parse(await readTextFile(snippetsIndexFilePath));
    } else {
      return noSnippet;
    }
  },
);

export const saveSnippets = createAsyncThunk(
  "snippets/save",
  async (_, { getState }) => {
    // save to local file
    const state: any = getState() as RootState;
    const snippetsIndexFilePath = await path.join(
      state.settings.currentWorkspace.data_dir,
      SnippetsFileName,
    );
    await checkParentDir(state.settings.currentWorkspace.data_dir);
    await writeTextFile(
      snippetsIndexFilePath,
      JSON.stringify(state.snippets, null, 2),
    );
  },
);

export const snippetsSlice = createSlice({
  name: "snippets",
  initialState: noSnippet,
  reducers: {
    addSnippet: (state, action) => {
      state.push(action.payload);
    },
    updateSnippetByIndex: (state, action) => {
      state.splice(action.payload.index, 1, action.payload.snippet);
    },
    removeSnippetByIndex: (state, action) => {
      state.splice(action.payload, 1);
    },
    reorderSnippet: (state, action) => {
      const moved = state.splice(action.payload.sourceIndex, 1);
      state.splice(action.payload.destinationIndex, 0, ...moved);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readSnippets.fulfilled, (_, action) => action.payload);
    builder.addCase(saveSnippets.fulfilled, () => {});
  },
});

export const {
  addSnippet,
  updateSnippetByIndex,
  removeSnippetByIndex,
  reorderSnippet,
} = snippetsSlice.actions;

export default snippetsSlice.reducer;
