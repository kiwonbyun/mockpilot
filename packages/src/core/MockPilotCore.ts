import { EventEmitter, MockPilotEvent } from "./EventEmitter";
import { MSWManager } from "./MSWManager";
import { StorageManager } from "./StorageManager";
import { Handler } from "./types";

export class MockPilotCore {
  private static instance: MockPilotCore | null = null;

  private isDevelopment: boolean;
  private isInitialized: boolean;
  private handlers: Handler[] = [];
  private eventEmitter: EventEmitter<MockPilotEvent>;
  private storageManager: StorageManager;
  private mswManager: MSWManager;

  private constructor() {
    this.isDevelopment = this.checkIsDevelopment();
    this.isInitialized = false;
    this.eventEmitter = new EventEmitter();
    this.storageManager = new StorageManager();
    this.mswManager = new MSWManager(this);
  }

  public static getInstance(): MockPilotCore {
    if (!MockPilotCore.instance) {
      MockPilotCore.instance = new MockPilotCore();
    }
    return MockPilotCore.instance;
  }

  private checkIsDevelopment(): boolean {
    const isServer = typeof window === "undefined";

    if (isServer) {
      return process.env.NODE_ENV !== "production";
    } else {
      return (
        process.env.NODE_ENV === "development" ||
        process.env.MODE === "development" ||
        process.env.VITE_USER_NODE_ENV === "development"
      );
    }
  }

  public async init(): Promise<void> {
    if (!this.isDevelopment) {
      console.log("hite");
      console.debug("MockPilot is disabled in production environment");
      return;
    }

    if (this.isInitialized) {
      console.debug("MockPilot is already initialized");
      return;
    }

    // msw 시작하기 전에 일단 저장된 핸들러를 불러와서 세팅해주고
    const savedHandlers = this.storageManager.loadHandlers();
    if (savedHandlers.length > 0) {
      this.handlers = savedHandlers;
    }

    this.mswManager.setupWorker();
    this.mswManager.registerHandlers(this.handlers);
    await this.mswManager.start();
    this.isInitialized = true;
    this.eventEmitter.emit(MockPilotEvent.INITIALIZED);
  }

  public addHandler(handler: Handler): string {
    if (!this.isDevelopment) return "";

    const handlerId =
      handler.id ||
      `handler-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    const newHandler = { ...handler, id: handlerId };

    this.handlers.push(newHandler);

    if (this.isInitialized) {
      this.mswManager.registerHandlers([newHandler]);
    }

    this.storageManager.saveHandlers(this.handlers);
    this.eventEmitter.emit(MockPilotEvent.HANDLER_CHANGED, newHandler);

    return handlerId;
  }

  public removeHandler(id: string): void {
    if (!this.isDevelopment) return;

    const handlerIndex = this.handlers.findIndex((h) => h.id === id);
    if (handlerIndex === -1) return;

    this.handlers.splice(handlerIndex, 1);

    if (this.isInitialized) {
      this.mswManager.updateHandlers(this.handlers);
    }

    this.storageManager.saveHandlers(this.handlers);
    this.eventEmitter.emit(MockPilotEvent.HANDLER_CHANGED, id);
  }

  public updateHandler(id: string, updates: Partial<Handler>): void {
    if (!this.isDevelopment) return;

    const handlerIndex = this.handlers.findIndex((h) => h.id === id);
    if (handlerIndex === -1) return;

    this.handlers[handlerIndex] = {
      ...this.handlers[handlerIndex],
      ...updates,
    };

    if (this.isInitialized) {
      this.mswManager.updateHandlers(this.handlers);
    }

    this.storageManager.saveHandlers(this.handlers);
    this.eventEmitter.emit(MockPilotEvent.HANDLER_CHANGED, id, updates);
  }

  public getHandlers(): Handler[] {
    return [...this.handlers];
  }

  public reset() {
    if (!this.isDevelopment) return;
    this.handlers = [];
    if (this.isInitialized) {
      this.mswManager.updateHandlers(this.handlers);
    }
    this.storageManager.clearHandlers();
    this.eventEmitter.emit(MockPilotEvent.HANDLER_CHANGED);
  }

  public cleanup() {
    if (!this.isDevelopment) return;
    if (this.isInitialized) {
      this.mswManager.stop();
    }
    this.eventEmitter.clear();
    this.isInitialized = false;
  }

  public on(event: MockPilotEvent, listener: (...args: any[]) => void) {
    return this.eventEmitter.on(event, listener);
  }

  public isDevEnvironment(): boolean {
    return this.isDevelopment;
  }
}

function createNoopMockPilot(): MockPilotCore {
  const noop = () => {};
  let initializedListener: (() => void) | null = null;

  return {
    init: () => {
      // If a listener for INITIALIZED was registered, call it.
      if (initializedListener) {
        initializedListener();
      }
    },
    addHandler: () => "",
    removeHandler: noop,
    updateHandler: noop,
    getHandlers: () => [],
    reset: noop,
    cleanup: noop,
    on: (event: MockPilotEvent, listener: (...args: any[]) => void) => {
      if (event === MockPilotEvent.INITIALIZED) {
        initializedListener = listener as () => void;
      }
      return noop; // Return a noop unsubscribe function
    },
    isDevEnvironment: () => false,
  } as unknown as MockPilotCore;
}

export const mockPilot =
  process.env.NODE_ENV !== "production"
    ? MockPilotCore.getInstance()
    : createNoopMockPilot();
