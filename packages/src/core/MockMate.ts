import { http, HttpResponse, delay, passthrough } from "msw";
import { setupWorker } from "msw/browser";
import type { MockConfig, MockMate, MockState } from "./types";

class MockMateImpl implements MockMate {
  private worker;
  private mocks: Map<string, MockState>;

  constructor() {
    this.worker = setupWorker();
    this.mocks = new Map();
  }

  async start() {
    if (process.env.NODE_ENV === "development") {
      await this.worker
        .start({ onUnhandledRequest: "bypass" })
        .catch((error) => {
          if (!error.message.includes("redundant")) {
            console.warn("MockMate initialization warning:", error);
          }
        });
    } else {
      console.warn("MockMate should only be used in development environment");
    }
  }

  private generateMockId(config: MockConfig): string {
    return `${config.method || "get"}-${config.url}`;
  }

  mock(config: MockConfig) {
    const id = this.generateMockId(config);
    const mockState: MockState = {
      id,
      isActive: true,
      method: config.method || "get",
      url: config.url,
      status: config.status,
      delay: config.delay || 0,
      response: config.response,
    };

    this.mocks.set(id, mockState);
    this.updateWorker();
  }

  private updateWorker() {
    this.worker.resetHandlers();
    const handlers = Array.from(this.mocks.values())
      .filter((mock) => mock.isActive)
      .map((mock) => {
        const method = mock.method || "get";
        return http[method](mock.url, async () => {
          // 지연 시간 적용
          if (mock.delay) {
            await delay(mock.delay);
          }

          if (!mock.status) {
            return passthrough();
          } else if (mock.status >= 400) {
            const errorBody = {
              message: `${mock.status} error occurred`,
              ok: false,
              data: mock.response,
              status: mock.status,
            };
            return HttpResponse.json(errorBody, {
              status: mock.status,
              statusText: `HTTP Error ${mock.status}`,
            });
          } else {
            const successBody = {
              message: `${mock.status} success`,
              ok: true,
              data: mock.response,
              status: mock.status,
            };
            return HttpResponse.json(successBody, {
              status: mock.status,
            });
          }
        });
      });

    this.worker.use(...handlers);
  }

  disable(id: string) {
    const mock = this.mocks.get(id);
    if (mock) {
      mock.isActive = false;
      this.mocks.set(id, mock);
      this.updateWorker();
    }
  }

  enable(id: string) {
    const mock = this.mocks.get(id);
    if (mock) {
      mock.isActive = true;
      this.mocks.set(id, mock);
      this.updateWorker();
    }
  }
  remove(id: string) {
    const mock = this.mocks.get(id);
    if (mock) {
      this.mocks.delete(id);
      this.updateWorker();
    }
  }

  reset() {
    this.mocks.clear();
    this.updateWorker();
  }

  getMocks(): MockState[] {
    return Array.from(this.mocks.values());
  }
}

export const mockmate = new MockMateImpl();
