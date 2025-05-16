type EventListener = (...args: any[]) => void;

export enum MockPilotEvent {
  INITIALIZED = "initialized",
  HANDLER_CHANGED = "handlerChanged",
}

export class EventEmitter<E extends string | symbol | number> {
  private events: Map<E, Set<EventListener>>;

  constructor() {
    this.events = new Map<E, Set<EventListener>>();
  }

  /**
   * 지정된 이벤트에 대한 리스너를 등록합니다.
   * 동일한 리스너가 이미 등록되어 있다면 중복 등록되지 않습니다.
   * @param event 이벤트 이름
   * @param listener 이벤트 발생 시 호출될 콜백 함수
   * @returns 구독 취소 함수
   */
  on(event: E, listener: EventListener): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set<EventListener>());
    }
    this.events.get(event)!.add(listener); // Set에 추가하면 중복은 알아서 처리됨

    // 구독 취소 함수 반환
    return () => this.off(event, listener);
  }

  /**
   * 지정된 이벤트에서 리스너를 제거합니다.
   * @param event 이벤트 이름
   * @param listener 제거할 리스너 함수
   */
  off(event: E, listener: EventListener): void {
    if (!this.events.has(event)) return;

    const listeners = this.events.get(event)!;
    listeners.delete(listener);

    // 해당 이벤트에 더 이상 리스너가 없으면 Map에서 키를 제거 (선택적)
    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  /**
   * 이벤트를 발생시켜 해당 이벤트의 모든 리스너를 호출합니다.
   * @param event 발생시킬 이벤트 이름
   * @param args 리스너에 전달할 인자들
   */
  emit(event: E, ...args: any[]): void {
    if (!this.events.has(event)) return;

    // Set을 배열로 변환하여 순회 (Set 자체도 순회 가능하지만, 안전하게 배열로 복사)
    const listeners = Array.from(this.events.get(event)!);
    for (const listener of listeners) {
      listener(...args);
    }
  }

  /**
   * 모든 이벤트를 초기화합니다.
   */
  clear(): void {
    this.events.clear();
  }
}
