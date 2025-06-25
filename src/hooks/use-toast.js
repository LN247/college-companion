import { useCallback } from "react";
import { useToastStore } from "./use-toast-store";

export function useToast() {
  const { addToast } = useToastStore();

  const toast = useCallback(
    ({ title, description, variant }) => {
      addToast({ title, description, variant });
    },
    [addToast]
  );

  return { toast };
}
