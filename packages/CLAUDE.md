# MockPilot 설계 문서

## 개요

MockPilot은 MSW(Mock Service Worker)를 기반으로 한 React 전용 API 모킹 라이브러리입니다. 개발자들이 MSW를 직접 다루지 않고도 간단한 UI를 통해 네트워크 요청을 모킹할 수 있게 해줍니다.

## 핵심 설계 원칙

1. **React 친화적 API**: React 컴포넌트와 함께 사용하기 쉬운 인터페이스 제공
2. **쉬운 사용성**: MSW에 대한 사전 지식 없이도 사용 가능
3. **일관된 UI**: React 컴포넌트로 일관된 사용자 경험 제공
4. **영구적 저장**: 로컬 스토리지를 활용한 모킹 설정 유지
5. **개발 환경 전용**: 프로덕션 환경에서는 자동으로 비활성화되어 불필요한 리소스 사용 방지

## 기술 스택

- **코어 로직**: Vanilla JavaScript (싱글톤 패턴)
- **UI 구현**: React 컴포넌트
- **네트워크 모킹**: MSW v2 (peerDependency)
- **데이터 저장**: LocalStorage (외부 상태관리 의존성 없음)

## 의존성 관리

MockPilot은 MSW를 peerDependency로 설정합니다:

```json
"peerDependencies": {
  "msw": "^2.0.0",
  "react": "^16.8.0 || ^17.0.0 || ^18.0.0",
  "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0"
}
```

peerDependency를 선택한 이유:

1. **사용자 버전 선택권**: 사용자가 자신의 프로젝트에 적합한 MSW 버전을 선택할 수 있음
2. **버전 충돌 방지**: 프로젝트에 이미 MSW가 설치되어 있는 경우 중복 설치 및 버전 충돌 방지
3. **번들 크기 최적화**: 라이브러리 크기를 줄이고 중복 패키지 방지
4. **명확한 의존성 전달**: MSW가 필수적인 기술 의존성임을 명확히 전달

설치 시 사용자는 다음과 같이 MSW를 함께 설치해야 합니다:

```bash
npm install -D mockpilot msw@^2.0.0
```

## 아키텍처

### 1. 코어 모듈 (Core Module)

싱글톤 패턴을 적용한, 메인 진입점과 상태 관리를 담당하는 모듈입니다.

```javascript
// 예시 코드
class MockPilotCore {
  static instance;

  constructor() {
    if (MockPilotCore.instance) {
      return MockPilotCore.instance;
    }

    this.handlers = [];
    this.worker = null;
    this.isInitialized = false;
    this.eventEmitter = new EventEmitter();
    this.isDevelopment = this.checkIsDevelopment();

    MockPilotCore.instance = this;
  }

  // 개발 환경인지 확인
  checkIsDevelopment() {
    // 다양한 환경 확인 방법
    return (
      process.env.NODE_ENV === "development" ||
      process.env.MODE === "development" ||
      process.env.VITE_USER_NODE_ENV === "development"
    );
  }

  init() {
    // 프로덕션 환경에서는 초기화하지 않음
    if (!this.isDevelopment) {
      console.debug("MockPilot is disabled in production environment");
      return;
    }
    /* MSW 초기화 로직 */
  }

  addHandler(handler) {
    if (!this.isDevelopment) return;
    /* 핸들러 추가 */
  }

  removeHandler(id) {
    if (!this.isDevelopment) return;
    /* 핸들러 제거 */
  }

  updateHandler(id, newConfig) {
    if (!this.isDevelopment) return;
    /* 핸들러 업데이트 */
  }

  reset() {
    if (!this.isDevelopment) return;
    /* 모든 핸들러 리셋 */
  }

  cleanup() {
    if (!this.isDevelopment) return;
    /* 메모리 정리 */
  }
}

export const mockPilot = new MockPilotCore();
```

### 2. 스토리지 관리 (Storage Management)

로컬 스토리지를 통한 핸들러 정보 저장 및 복원을 담당합니다.

```javascript
// 예시 코드
class StorageManager {
  constructor() {
    this.storageKey = "mockpilot-handlers";
  }

  saveHandlers(handlers) {
    localStorage.setItem(this.storageKey, JSON.stringify(handlers));
  }

  loadHandlers() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  clearHandlers() {
    localStorage.removeItem(this.storageKey);
  }
}
```

### 3. MSW 연동 (MSW Integration)

MSW 설정 및 핸들러 등록을 담당합니다.

```javascript
// 예시 코드
class MSWManager {
  constructor(core) {
    this.core = core;
    this.worker = null;
  }

  async setupWorker() {
    // MSW worker 설정
  }

  registerHandlers(handlers) {
    // MSW에 핸들러 등록
  }

  start() {
    // MSW worker 시작
  }

  stop() {
    // MSW worker 중지
  }
}
```

### 4. 이벤트 관리 (Event Management)

컴포넌트 간 통신을 담당하는 이벤트 이미터 구현:

```javascript
// 예시 코드
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(...args));
  }

  clear() {
    this.events = {};
  }
}
```

### 5. UI 컴포넌트 (React)

React 컴포넌트를 사용한 UI 구현:

#### 메인 프로바이더 컴포넌트

```jsx
// 예시 코드
import React, { useEffect } from "react";
import { mockPilot } from "./core";

export const MockPilotProvider = ({ children }) => {
  useEffect(() => {
    // 라이브러리 초기화
    mockPilot.init();

    // 컴포넌트 언마운트 시 정리
    return () => {
      mockPilot.cleanup();
    };
  }, []);

  return children;
};
```

#### 컨트롤 패널 컴포넌트

```jsx
// 예시 코드
import React, { useState, useEffect } from "react";
import { mockPilot } from "./core";

export const MockPilotPanel = () => {
  const [handlers, setHandlers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 핸들러 데이터 로드
    const loadHandlers = () => {
      setHandlers(mockPilot.getHandlers());
    };

    // 이벤트 구독
    const unsubscribe = mockPilot.eventEmitter.on(
      "handlersChanged",
      loadHandlers
    );
    loadHandlers();

    return unsubscribe;
  }, []);

  return (
    <div className="mockpilot-panel">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close" : "Open"} MockPilot
      </button>

      {isOpen && (
        <div className="mockpilot-content">{/* 핸들러 목록 및 UI 구현 */}</div>
      )}
    </div>
  );
};
```

#### 기타 하위 컴포넌트

- `HandlerItem` - 개별 핸들러 UI
- `HandlerForm` - 핸들러 생성/편집 폼
- `ToggleSwitch` - 활성화/비활성화 토글
- `JsonEditor` - JSON 에디터

## 사용자 API

### 초기화 및 UI 표시

```jsx
// App.js 또는 진입점 컴포넌트
import React from "react";
import { MockPilotProvider, MockPilotPanel } from "mockpilot";

function App() {
  return (
    <MockPilotProvider>
      {/* 애플리케이션 컴포넌트들 */}
      <YourApp />

      {/* MockPilot UI - 개발 환경에서만 렌더링됨 */}
      {process.env.NODE_ENV === "development" && <MockPilotPanel />}
    </MockPilotProvider>
  );
}
```

또는 프로그래매틱하게 코어 API 직접 사용:

```javascript
// 코어 API 직접 사용
import { mockPilot } from "mockpilot/core";

// 앱 시작 시 초기화
mockPilot.init();

// 정리 (SPA에서 라우트 변경 또는 컴포넌트 언마운트 시)
cleanup = () => {
  mockPilot.cleanup();
};
```

### 프로그래매틱 API

```javascript
// 핸들러 직접 추가
mockPilot.addHandler({
  id: "get-users",
  method: "GET",
  url: "/api/users",
  status: 200,
  delay: 500,
  response: { users: [] },
});

// 핸들러 제거
mockPilot.removeHandler("get-users");

// 모든 핸들러 초기화
mockPilot.reset();

// 정리 (페이지 언로드 시)
mockPilot.cleanup();
```

## 메모리 관리 및 클린업

메모리 누수 방지를 위한 전략:

1. **명시적 클린업 메서드**: `mockPilot.cleanup()`을 제공해 리소스 정리
2. **이벤트 리스너 관리**: 모든 이벤트 리스너 추적 및 해제
3. **가비지 컬렉션 지원**: 약한 참조(WeakMap/WeakSet) 사용
4. **종속성 제거**: Web Component의 `disconnectedCallback`에서 참조 제거

## 개발 환경 전용 동작

MockPilot은 개발 도구로써 프로덕션 빌드에서는 실행되지 않도록 설계되었습니다:

1. **자동 환경 감지**: `process.env.NODE_ENV` 등의 환경 변수를 통해 개발/프로덕션 환경 구분
2. **프로덕션 비활성화**: 프로덕션 환경에서는 모든 기능이 자동으로 비활성화됨
3. **메모리 사용 최소화**: 프로덕션 환경에서는 핸들러나 상태 정보가 메모리에 로드되지 않음
4. **환경별 번들링**: 프로덕션 빌드에서는 실제 기능 코드가 트리쉐이킹되어 제거됨
5. **제로 오버헤드**: 프로덕션에서 불필요한 네트워크 요청 중간처리나 UI 렌더링이 발생하지 않음

개발 환경 전용 동작을 위한 구현 방식:

```javascript
// 트리쉐이킹 가능한 조건부 내보내기
export const mockPilot =
  process.env.NODE_ENV !== "production"
    ? new MockPilotCore()
    : createNoopMockPilot();

// 프로덕션용 더미 구현체 - 모든 메서드가 빈 구현
function createNoopMockPilot() {
  return {
    init: () => {},
    addHandler: () => {},
    removeHandler: () => {},
    updateHandler: () => {},
    reset: () => {},
    cleanup: () => {},
    // ... 다른 모든 메서드
  };
}
```

## 구현 로드맵

1. 코어 모듈 구현 (싱글톤 패턴, 이벤트 이미터)
2. 개발/프로덕션 환경 감지 및 조건부 동작 구현
3. MSW 연동 모듈 구현
4. 스토리지 관리 모듈 구현
5. 기본 UI 웹 컴포넌트 구현
6. 고급 기능 추가 (지연 시간, 상태 코드, JSON 편집기)
7. 문서화 및 예제 개발

## 확장 가능성

1. **플러그인 시스템**: 사용자 정의 확장 지원
2. **미들웨어 지원**: 요청/응답 처리 파이프라인
3. **원격 저장소 연동**: 팀 간 모킹 설정 공유
4. **React Hook**: 커스텀 훅 제공 (`useMockPilot`)
5. **테마 지원**: 다크 모드 등 UI 테마 설정
6. **브라우저 익스텐션**: 별도의 브라우저 탭에서 관리
