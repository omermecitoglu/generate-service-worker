/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;
declare const clients: Clients;
declare global {
  const BUILD_ID: string;
  const STATIC_FILES: string[];
}
export {};
