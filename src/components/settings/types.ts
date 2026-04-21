import type { UseFormReturnType } from "@mantine/form";
import type { SettingsState } from "@/types/settings.ts";

export interface SettingsExtended extends SettingsState {
  password?: string;
}

export interface SettingsFormProps {
  form: UseFormReturnType<SettingsExtended>;
}
