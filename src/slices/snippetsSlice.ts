import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { Snippet } from "@/types/snippet.ts";
import type { RootState } from "@/store.ts";
import { checkParentDir } from "@/slices/common.ts";

const SnippetsFileName = "snippets.json";

const noSnippet: Snippet[] = [];

export const readSnippets = createAsyncThunk(
  "snippets/read",
  async (_, { getState }): Promise<Snippet[]> => {
    // read from local file
    const state = getState() as RootState;
    if (await exists(state.settings.data_dir + SnippetsFileName)) {
      // Read and parse
      const snippetsFile = await readTextFile(
        state.settings.data_dir + SnippetsFileName,
      );
      return JSON.parse(snippetsFile);
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
    await checkParentDir(state.settings.data_dir);
    await writeTextFile(
      state.settings.data_dir + SnippetsFileName,
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
