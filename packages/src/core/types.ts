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
