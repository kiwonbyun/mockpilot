import { FallbackProps } from "react-error-boundary";
import JsonDisplay from "./JsonDisplay";

function GalleryErrorUI({ resetErrorBoundary, error }: FallbackProps) {
  return (
    <div className="absolute top-0 left-0 size-full bg-black/80 p-10 flex flex-col gap-4">
      <h3 className="text-5xl text-red-600">there was an error!</h3>
      <h3 className="text-3xl text-red-400">error message: {error.message}</h3>
      <div>
        <p className="text-white">
          GET request to{" "}
          <code className="px-1 bg-black/1s0 rounded text-orange-500 bg-gray-900">
            https://fake-api.com/photos
          </code>{" "}
          failed.
        </p>
        <p className="text-white">
          You can resolve this by mocking the API in <b>MOCKMATE</b>.
        </p>
        <p className="text-white">
          Please register the mock data below in <b>MOCKMATE</b>.
        </p>
        <p className="text-white">
          The <b>MOCKMATE</b> tool is in the bottom-right corner of the screen.
          Click the icon!
        </p>
      </div>
      <div>
        <p className="text-white leading-9">Method: GET</p>
        <p className="text-white leading-9">
          Endpoint URL: https://fake-api.com/photos
        </p>
        <p className="text-white leading-9">Response Delay: 3000ms</p>
        <p className="text-white leading-9">Response Status: Success</p>
        <p className="text-white leading-9">Response Body</p>
        <JsonDisplay
          data={[
            {
              id: 0,
              url: "https://images.unsplash.com/photo-1496871455396-14e56815f1f4?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 1,
              url: "https://plus.unsplash.com/premium_photo-1682656220562-32fde8256295?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 2,
              url: "https://plus.unsplash.com/premium_photo-1672116452571-896980a801c8?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 3,
              url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 4,
              url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 5,
              url: "https://images.unsplash.com/photo-1422360902398-0a91ff2c1a1f?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 6,
              url: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 7,
              url: "https://plus.unsplash.com/premium_photo-1674309438579-587b58d8486e?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 8,
              url: "https://plus.unsplash.com/premium_photo-1669927131902-a64115445f0f?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 9,
              url: "https://plus.unsplash.com/premium_photo-1682048358672-1c5c6c9ed2ae?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 10,
              url: "https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-white">
          After registering the mock data, please click the RESET button below
        </p>
        <button
          className="border-solid border-2 rounded-md px-4 py-1 text-white text-xl bg-gray-700 hover:bg-slate-500"
          onClick={resetErrorBoundary}
        >
          RESET
        </button>
      </div>
    </div>
  );
}

export default GalleryErrorUI;
