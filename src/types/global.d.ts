declare global {
  interface Window {
    knouxAPI?: {
      settings: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
        getAll: () => Promise<any>;
      };
      system: {
        getGPUInfo: () => Promise<any>;
        getSystemInfo: () => Promise<any>;
      };
      media: {
        loadFile: (path: string) => Promise<any>;
        getMetadata: (path: string) => Promise<any>;
        play: () => Promise<any>;
        pause: () => Promise<any>;
        stop: () => Promise<any>;
      };
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
        send: (channel: string, ...args: any[]) => void;
        on: (channel: string, listener: Function) => void;
        removeListener: (channel: string, listener: Function) => void;
      };
      file: {
        openDialog: (options?: any) => Promise<any>;
        saveDialog: (options?: any) => Promise<any>;
      };
    };
  }
}

export {};
