"use client";
import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";

type ModifierKey = "Alt" | "AltGraph" | "Control" | "Shift" | "Meta";
type NavigationKey =
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "End"
  | "Home"
  | "PageDown"
  | "PageUp";
type ActionKey = "Enter" | "Tab" | "Escape" | "Backspace" | "Delete" | "Space";

type KeyboardKey = ModifierKey | NavigationKey | ActionKey;
type KeyboardEventType = "keydown" | "keyup";

function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["addEventListener"]> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(
      ...(args as Parameters<HTMLElement["addEventListener"]>)
    );
  }
}

function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args:
    | Parameters<T["removeEventListener"]>
    | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(
      ...(args as Parameters<HTMLElement["removeEventListener"]>)
    );
  }
}

const useKeyPress = (
  targetKey: KeyboardKey | KeyboardKey[],
  keydownCallback: (e: KeyboardEvent) => void,
  keyupCallback?: (e: KeyboardEvent) => void,
  elementRef?: RefObject<HTMLElement>
) => {
  const savedCallbacks = useRef({
    keydown: keydownCallback,
    keyup: keyupCallback || (() => {}),
  });

  const targetKeys = Array.isArray(targetKey) ? targetKey : [targetKey];

  // 콜백 업데이트
  useEffect(() => {
    savedCallbacks.current.keydown = keydownCallback;
    savedCallbacks.current.keyup = keyupCallback || (() => {});
  }, [keydownCallback, keyupCallback]);

  // 이벤트 타입에 따른 핸들러 생성 함수
  const createHandler = useCallback(
    (eventType: KeyboardEventType) => (e: KeyboardEvent) => {
      if (targetKeys.includes(e.key as KeyboardKey)) {
        savedCallbacks.current[eventType](e);
      }
    },
    [targetKeys]
  );

  // 이벤트 리스너 설정
  useEffect(() => {
    const element = elementRef?.current || document;
    if (!element) return;

    const keydownHandler = createHandler("keydown");
    // keyupCallback이 제공된 경우에만 keyup 이벤트 리스너 등록
    const keyupHandler = keyupCallback ? createHandler("keyup") : null;

    on(element, "keydown", keydownHandler);

    if (keyupHandler) {
      on(element, "keyup", keyupHandler);
    }

    return () => {
      off(element, "keydown", keydownHandler);

      if (keyupHandler) {
        off(element, "keyup", keyupHandler);
      }
    };
  }, [createHandler, elementRef, keyupCallback]);
};

export default useKeyPress;
