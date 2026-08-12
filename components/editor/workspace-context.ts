/**
 * React context exposing editor actions (refresh, open page, insert component…) to panels.
 */
"use client";

import { createContext, useContext } from "react";

export interface WorkspaceCtx {
  refresh: () => Promise<void>;
  openPage: (path: string) => void;
  insertComponent: (name: string) => Promise<void>;
  insertLibrary: (id: string) => Promise<void>;
  saveAsComponent: () => Promise<void>;
  bumpReload: () => void;
  setPublishOpen: (open: boolean) => void;
  exportProject: () => void;
  flushSave: () => Promise<void>;
}

export const WorkspaceCtxValue = createContext<WorkspaceCtx | null>(null);
export const useWorkspace = () => useContext(WorkspaceCtxValue)!;
