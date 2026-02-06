"use client";

import { Toaster } from "sonner";
import { useTheme } from "./app-shell/theme-provider";

export default function ThemedToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      richColors
      theme={theme as "system" | "dark" | "light" | undefined}
    />
  );
}
