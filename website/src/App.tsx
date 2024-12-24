import Gallery from "./components/Gallery";
import AsyncBoundary from "./components/AsyncBoundary";
import GallerySkeleton from "./components/GallerySkeleton";
import GalleryErrorUI from "./components/GalleryErrorUI";

function App() {
  return (
    <div className="mx-20 flex flex-col gap-5 h-svh">
      <h1 className="text-4xl font-bold text-center mt-3">
        MockPilot Demo Page
      </h1>
      <button>asd</button>
      <AsyncBoundary
        loadingFallback={<GallerySkeleton />}
        errorFallback={({ resetErrorBoundary, error }) => (
          <GalleryErrorUI
            resetErrorBoundary={resetErrorBoundary}
            error={error}
          />
        )}
      >
        <Gallery />
      </AsyncBoundary>
    </div>
  );
}

export default App;
