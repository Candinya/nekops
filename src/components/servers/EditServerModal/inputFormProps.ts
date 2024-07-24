import type { UseFormReturnType } from "@mantine/form";
import type { Server } from "@/types/server.ts";

export interface InputFormProps {
  form: UseFormReturnType<Server, (values: Server) => Server>;
}
