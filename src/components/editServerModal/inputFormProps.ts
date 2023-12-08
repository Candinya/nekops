import type { UseFormReturnType } from "@mantine/form";

export interface InputFormProps {
  form: UseFormReturnType<Server, (values: Server) => Server>;
}
