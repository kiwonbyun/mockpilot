import DeleteIcon from "./DeleteIcon";
import { mockPilot } from "../core/MockPilot";
import { Dispatch, SetStateAction } from "react";
import { HttpMethod, HttpStatus, MockState } from "../core/types";

interface IMockList {
  setUrl: Dispatch<SetStateAction<string>>;
  setMethod: Dispatch<SetStateAction<HttpMethod>>;
  setDelay: Dispatch<SetStateAction<number>>;
  setStatus: Dispatch<SetStateAction<HttpStatus>>;
  setMockRes: Dispatch<SetStateAction<string>>;
}

function MocksList({
  setUrl,
  setMethod,
  setDelay,
  setStatus,
  setMockRes,
}: IMockList) {
  const mocks = mockPilot.getMocks();

  const handleClick = (mock: MockState) => {
    setUrl(mock.url);
    setMethod(mock.method as HttpMethod);
    setDelay(mock.delay);
    setStatus(mock.status as HttpStatus);
    setMockRes(JSON.stringify(mock.response));
  };

  return (
    <ul data-mock-list>
      {mocks.map((mock) => (
        <li
          data-mock-item
          data-mock-item-isactive={mock.isActive}
          key={mock.id}
          onClick={() => handleClick(mock)}
        >
          <div data-mm-gap-box>
            <button
              data-method-badge
              data-method-badge-value={mock.method}
              data-method-badge-isactive={mock.isActive}
              onClick={(e) => {
                mock.isActive
                  ? mockPilot.disable(mock.id)
                  : mockPilot.enable(mock.id);
                e.stopPropagation();
              }}
            >
              {mock.method?.toUpperCase()}
            </button>
            <span>{mock.url}</span>
          </div>
          <div data-mm-gap-box>
            <button data-mm-delay-badge>{`${mock.delay / 1000}s`}</button>
            {!mock.status && <button data-mm-pass-badge>pass</button>}
            {mock.status === 200 && (
              <button data-mm-success-badge>success</button>
            )}
            {mock.status && mock.status >= 400 && (
              <button data-mm-error-badge>error</button>
            )}
            <button
              data-mm-delete-badge
              style={{ cursor: "pointer" }}
              onClick={() => mockPilot.remove(mock.id)}
            >
              <DeleteIcon />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MocksList;
