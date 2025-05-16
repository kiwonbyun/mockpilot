import { Handler } from "./types";

export class StorageManager {
  private storageKey: string;

  constructor(key: string = "mockpilot-handlers") {
    this.storageKey = key;
  }

  /**
   * 핸들러 목록을 로컬 스토리지에 저장
   * @param handlers 저장할 핸들러 목록
   */
  saveHandlers(handlers: Handler[]) {
    try {
      if (!this.checkIsBrowser()) {
        console.warn("localStorage is not available in this environment");
        return;
      }
      localStorage.setItem(this.storageKey, JSON.stringify(handlers));
    } catch (err) {
      console.error("Failed to save handlers to localStorage", err);
    }
  }

  /**
   * 로컬 스토리지에서 핸들러 목록 불러오기
   * @returns 로드된 핸들러 목록
   */
  loadHandlers() {
    try {
      if (!this.checkIsBrowser()) {
        console.warn("localStorage is not available in this environment");
        return [];
      }

      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];

      const handlers = JSON.parse(data);

      if (!Array.isArray(handlers)) {
        console.warn(
          "Invalid handlers data in localStorage. Clearing and starting fresh!"
        );
        this.clearHandlers();
        return [];
      }

      return handlers.filter((handler) => {
        const isValid =
          handler &&
          typeof handler === "object" &&
          typeof handler.id === "string" &&
          typeof handler.method === "string" &&
          typeof handler.url === "string";

        if (!isValid) {
          console.warn(
            "Invalid handler found in localStorage, filtering out:",
            handler
          );
        }

        return isValid;
      });
    } catch (err) {
      console.error("Failed to load handlers from localStorage:", err);
      return [];
    }
  }

  /**
   * 로컬 스토리지에서 핸들러 정보 제거
   */
  clearHandlers() {
    try {
      if (!this.checkIsBrowser()) {
        console.warn("localStorage is not available in this environment");
        return;
      }

      localStorage.removeItem(this.storageKey);
    } catch (err) {
      console.error("Failed to clear handlers from localStorage:", err);
    }
  }

  /**
   * 스토리지 키 변경
   * @param newKey 새로운 스토리지 키
   */
  setStorageKey(newKey: string) {
    if (!newKey || typeof newKey !== "string") {
      console.error("Invalid storage key provided");
      return;
    }

    const currentHandlers = this.loadHandlers();

    this.clearHandlers();
    this.storageKey = newKey;

    if (currentHandlers.length > 0) {
      this.saveHandlers(currentHandlers);
    }
  }

  /**
   * 브라우저 환경 확인
   * @returns 브라우저 환경 여부
   */
  private checkIsBrowser() {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  }
}
