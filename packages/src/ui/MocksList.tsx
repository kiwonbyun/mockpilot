import { Drawer } from "vaul";
import { MockState } from "../core/types";
import DeleteIcon from "./DeleteIcon";

interface MocksListProps {
  mocks: MockState[];
  handleRemove: (id: string) => void;
}

function MocksList({ mocks, handleRemove }: MocksListProps) {
  return (
    <Drawer.NestedRoot direction="right" data-drawer-root>
      <Drawer.Trigger
        data-mm-nested-trigger
      >{`View All Mocks.. (${mocks?.length})`}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay data-mm-drawer-overlay />
        <Drawer.Content data-mm-drawer-content>
          <div data-mm-drawer-content-wrapper>
            <Drawer.Title>Mocks List</Drawer.Title>
            <ul data-mock-list>
              {mocks.map((mock) => (
                <li data-mock-item key={mock.id}>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      data-method-badge
                      data-method-badge-value={mock.method}
                    >
                      {mock.method?.toUpperCase()}
                    </button>
                    <span>{mock.url}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    {!mock.status && <button data-mm-pass-badge>pass</button>}
                    <button data-mm-delay-badge>{`${mock.delay}ms`}</button>
                    {mock.status && mock.status >= 400 && (
                      <button data-mm-error-badge>error</button>
                    )}
                    <button
                      data-mm-delete-badge
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemove(mock.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.NestedRoot>
  );
}

export default MocksList;
