import DeleteIcon from "./DeleteIcon";
import { mockmate } from "../core/MockMate";

function MocksList() {
  const mocks = mockmate.getMocks();

  return (
    <ul data-mock-list>
      {mocks.map((mock) => (
        <li
          data-mock-item
          data-mock-item-isActive={mock.isActive}
          key={mock.id}
        >
          <div data-mm-gap-box>
            <button
              data-method-badge
              data-method-badge-value={mock.method}
              data-method-badge-isActive={mock.isActive}
              onClick={() =>
                mock.isActive
                  ? mockmate.disable(mock.id)
                  : mockmate.enable(mock.id)
              }
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
              onClick={() => mockmate.remove(mock.id)}
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
