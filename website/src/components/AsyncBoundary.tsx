import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

interface AsyncBoundaryProps {
  children: ReactNode;
  loadingFallback: ReactNode;
  errorFallback: (props: FallbackProps) => ReactNode;
}

function AsyncBoundary({
  children,
  loadingFallback,
  errorFallback,
}: AsyncBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={errorFallback}>
          <Suspense fallback={loadingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default AsyncBoundary;
