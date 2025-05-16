/**
 * API 핸들러 정의
 */
export interface Handler {
  id: string; // 핸들러 식별자
  method: string; // HTTP 메소드 (GET, POST, PUT, DELETE 등)
  url: string; // 요청 URL 또는 URL 패턴
  status: number; // 응답 상태 코드
  response: any; // 응답 데이터
  delay?: number; // 응답 지연 시간 (밀리초)
  active?: boolean; // 핸들러 활성화 여부 (기본값: true)
  description?: string; // 핸들러 설명
}

/**
 * MockPilot 초기화 옵션
 */
export interface MockPilotOptions {
  autoStart?: boolean; // 자동 시작 여부 (기본값: true)
  persistHandlers?: boolean; // 핸들러 저장 여부 (기본값: true)
  storageKey?: string; // 로컬 스토리지 키 (기본값: 'mockpilot-handlers')
  defaultDelay?: number; // 기본 지연 시간 (기본값: 0)
  logRequests?: boolean; // 요청 로깅 여부 (기본값: false)
}
