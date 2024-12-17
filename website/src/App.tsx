import Gallery from "./components/Gallery";
import AsyncBoundary from "./components/AsyncBoundary";
import GallerySkeleton from "./components/GallerySkeleton";
import JsonDisplay from "./components/JsonDisplay";

function App() {
  return (
    <div className="border mx-20 flex flex-col gap-5 h-svh">
      <h1 className="text-4xl font-bold text-center">MockMate Demo Page</h1>
      <AsyncBoundary
        loadingFallback={<GallerySkeleton />}
        errorFallback={({ resetErrorBoundary }) => (
          <div className="bg-black/40 h-full pt-3 px-4">
            <h3 className="text-4xl text-red-600">there was an error!</h3>
            <p>
              GET request to{" "}
              <code className="px-1 bg-black/1s0 rounded text-orange-800">
                https://fake-api.com/photos
              </code>{" "}
              failed.
            </p>
            <p>
              You can resolve this by mocking the API in <b>mockmate</b>.
            </p>
            <p>아래에 있는 json을 </p>
            <JsonDisplay
              data={[
                {
                  url: "https://images.unsplash.com/photo-1496871455396-14e56815f1f4?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://plus.unsplash.com/premium_photo-1682656220562-32fde8256295?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://plus.unsplash.com/premium_photo-1672116452571-896980a801c8?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://images.unsplash.com/photo-1422360902398-0a91ff2c1a1f?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://plus.unsplash.com/premium_photo-1674309438579-587b58d8486e?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://plus.unsplash.com/premium_photo-1669927131902-a64115445f0f?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://plus.unsplash.com/premium_photo-1682048358672-1c5c6c9ed2ae?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  url: "https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
              ]}
            />
            <button onClick={resetErrorBoundary}>reset</button>
          </div>
        )}
      >
        <Gallery />
      </AsyncBoundary>
    </div>
  );
}

export default App;
