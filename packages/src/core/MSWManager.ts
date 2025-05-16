import { setupWorker } from "msw/browser";
import { Handler } from "./types";
import { http, HttpResponse, RequestHandler } from "msw";

export interface IMockPilotCore {
  // MSWManager에서 필요한 메서드와 속성만 정의
  on(event: string, listener: Function): () => void;
  isDevEnvironment(): boolean;
  // 기타 필요한 메서드...
}

export class MSWManager {
  private worker: ReturnType<typeof setupWorker> | null = null;
  private isStarted: boolean = false;
  private core: IMockPilotCore;

  constructor(coreRef: IMockPilotCore) {
    this.core = coreRef;
  }

  async setupWorker(): Promise<void> {
    if (this.worker) return;

    try {
      this.worker = setupWorker();
      console.debug("MSW worker setup complete");
    } catch (err) {
      console.error("Failed to setup MSW worker:", err);
    }
  }

  registerHandlers(handlers: Handler[]) {
    if (!this.worker) {
      console.error("MSW worker is not initialized");
      return;
    }

    try {
      const mswHandlers = this.convertMSWHandlers(handlers);
      this.worker.use(...(mswHandlers as any));

      if (this.isStarted) {
        this.worker.resetHandlers();
        this.worker.use(...(mswHandlers as any));
      }

      console.debug(`Registered ${mswHandlers.length} MSW handlers`);
    } catch (err) {
      console.error("Failed to register MSW handlers:", err);
    }
  }

  updateHandlers(handlers: Handler[]): void {
    if (!this.worker) {
      console.error("Worker is not set up yet");
      return;
    }

    try {
      const mswHandlers = this.convertMSWHandlers(handlers);

      // 기존 핸들러 초기화 후 새로운 핸들러 등록
      this.worker.resetHandlers();
      this.worker.use(...(mswHandlers as any));

      console.debug(`Updated MSW with ${mswHandlers.length} handlers`);
    } catch (error) {
      console.error("Failed to update MSW handlers:", error);
    }
  }

  async start(): Promise<void> {
    if (!this.worker) {
      console.error("MSW worker is not set up yet");
      return;
    }

    if (this.isStarted) {
      console.debug("MSW worker is already started");
      return;
    }

    try {
      await this.worker.start({ onUnhandledRequest: "bypass" });
      this.isStarted = true;
      console.debug("MSW worker has started");
    } catch (err) {
      console.error("Failed to start MSW worker:", err);
    }
  }

  async stop(): Promise<void> {
    if (!this.worker || !this.isStarted) return;
    try {
      this.worker.resetHandlers();
      this.worker.stop();
      this.isStarted = false;
      console.debug("MSW worker has stopped");
    } catch (err) {
      console.error("Failed to stop MSW worker:", err);
    }
  }

  private convertMSWHandlers(handlers: Handler[]): RequestHandler[] {
    return handlers
      .filter((handler) => handler.active)
      .map((handler) => {
        const { method, url, status, response, delay = 0 } = handler;
        const supportedMethods = [
          "get",
          "post",
          "put",
          "delete",
          "patch",
          "options",
          "head",
        ];
        const lowerMethod = method.toLowerCase();
        if (!supportedMethods.includes(lowerMethod)) {
          throw new Error(`Unsupported HTTP method: ${method}`);
        }

        return http[lowerMethod as keyof typeof http](url, async () => {
          if (delay > 0) {
            await this.delay(delay);
          }

          return HttpResponse.json(response, { status });
        });
      });
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
