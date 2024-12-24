import React, { Dispatch, SetStateAction } from "react";
import JsonDisplay from "./JsonDisplay";

function GalleryDeleteErrorUI({
  setShowMutateInfo,
}: {
  setShowMutateInfo: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="absolute top-0 left-0 size-full bg-black/80 p-10 flex flex-col gap-4">
      <h3 className="text-5xl text-red-600">there was an error!</h3>
      <div>
        <p className="text-white">
          DELETE request to{" "}
          <code className="px-1 bg-black/1s0 rounded text-orange-500 bg-gray-900">
            https://fake-api.com/photos/:id
          </code>{" "}
          failed.
        </p>
        <p className="text-white">
          You can resolve this by mocking the API in <b>MOCKPILOT</b>.
        </p>
        <p className="text-white">
          Please register the mock data below in <b>MOCKPILOT</b>.
        </p>
        <p className="text-white">
          The <b>MOCKPILOT</b> tool is in the bottom-right corner of the screen.
          Click the icon!
        </p>
      </div>
      <div>
        <p className="text-white leading-9">Method: DELETE</p>
        <p className="text-white leading-9">
          Endpoint URL: https://fake-api.com/photos/:id?sort=desc
        </p>
        <p className="text-white leading-9">Response Delay: 1500ms</p>
        <p className="text-white leading-9">Response Status: Success</p>
        <p className="text-white leading-9">Response Body</p>
        <JsonDisplay
          data={{
            id: "{{id}}",
            title: "Delete photo {{id}}",
            description: "photo {{id}} is removed!",
            sort: "{{sort}}",
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-white">
          After registering the mock data, press the close button below and try
          to request the DELETE api again.
        </p>
        <button
          className="border-solid border-2 rounded-md px-4 py-1 text-white text-xl bg-gray-700 hover:bg-slate-500"
          onClick={() => setShowMutateInfo(false)}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}

export default GalleryDeleteErrorUI;
