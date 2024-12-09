import { Suspense } from "react";
import Gallery from "./components/Gallery";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <div className="website-border website-mx-20 website-flex website-flex-col website-gap-5">
      <h1 className="website-text-4xl website-font-bold website-text-center">
        MockMate Demo Page
      </h1>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <div>
                there was an error!
                <button onClick={resetErrorBoundary}>reset</button>
              </div>
            )}
          >
            <Suspense fallback={<h1>loading./..</h1>}>
              <Gallery />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

export default App;
