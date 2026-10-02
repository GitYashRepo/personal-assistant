declare module '@supersami/rn-foreground-service' {
  export interface TaskOptions {
    task: () => Promise<void>;
    taskName: string;
    delay: number;
    loopDelay?: number;
    onLoop?: boolean;
  }

  export interface StartOptions {
    id: number;
    title: string;
    message: string;
    icon?: string;
    setOnlyAlertOnce?: boolean;
    color?: string;
  }

  const ReactNativeForegroundService: {
    register: (config: { id?: number }) => void;
    addTask: (options: TaskOptions) => void;
    start: (options: StartOptions) => void;
    removeTask: (taskName: string) => void;
    stopAll: () => void;
    stop: () => void;
  };

  export default ReactNativeForegroundService;
}
