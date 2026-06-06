"use client";

import {
  createContext,
  use,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ChartPart } from "./parts/types";

type PartRegistryContextValue = {
  partsMapRef: React.RefObject<Map<string, ChartPart>>;
  version: number;
  registerSync: (part: ChartPart) => void;
  unregister: (id: string) => void;
};

const PartRegistryContext = createContext<PartRegistryContextValue | null>(null);

function serializePart(part: ChartPart): string {
  return JSON.stringify(part, (_key, value) => (typeof value === "function" ? 0 : value));
}

function partsEqual(a: ChartPart, b: ChartPart): boolean {
  return serializePart(a) === serializePart(b);
}

export function PartRegistryProvider({ children }: { children: ReactNode }) {
  const partsMapRef = useRef(new Map<string, ChartPart>());
  const [version, setVersion] = useState(0);
  const dirtyRef = useRef(false);

  const registerSync = useCallback((part: ChartPart) => {
    const existing = partsMapRef.current.get(part.id);
    if (existing && partsEqual(existing, part)) return;
    partsMapRef.current.set(part.id, part);
    dirtyRef.current = true;
  }, []);

  const unregister = useCallback((id: string) => {
    if (!partsMapRef.current.has(id)) return;
    partsMapRef.current.delete(id);
    dirtyRef.current = true;
  }, []);

  useLayoutEffect(() => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    setVersion((v) => v + 1);
  });

  const value = useMemo(
    () => ({
      partsMapRef,
      version,
      registerSync,
      unregister,
    }),
    [version, registerSync, unregister],
  );

  return <PartRegistryContext value={value}>{children}</PartRegistryContext>;
}

export function usePartRegistry() {
  const ctx = use(PartRegistryContext);
  if (!ctx) {
    throw new Error("usePartRegistry must be used within PartRegistryProvider");
  }
  return ctx;
}

/** Reads the live part map — siblings registered earlier in the same render are included. */
export function usePartsSnapshot(): ChartPart[] {
  const { partsMapRef, version } = usePartRegistry();
  return useMemo(
    () => Array.from(partsMapRef.current.values()),
    [partsMapRef, version],
  );
}

export function useRegisterPart(part: ChartPart) {
  const { registerSync, unregister } = usePartRegistry();
  const partRef = useRef(part);
  partRef.current = part;
  const partKey = serializePart(part);

  registerSync(part);

  useLayoutEffect(() => {
    registerSync(partRef.current);
  }, [partKey, registerSync]);

  useLayoutEffect(() => {
    const id = part.id;
    return () => unregister(id);
  }, [part.id, unregister]);
}

export function usePartId() {
  return useId().replace(/:/g, "");
}
