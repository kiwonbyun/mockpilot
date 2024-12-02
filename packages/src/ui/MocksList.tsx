import { Drawer } from "vaul";
import { MockState } from "../core/types";

interface MocksListProps {
  mocks: MockState[];
  handleRemove: (id: string) => void;
}

function MocksList({ mocks, handleRemove }: MocksListProps) {
  return (
    <Drawer.NestedRoot direction="right" data-drawer-root>
      <Drawer.Trigger>{`View All Mocks.. (${mocks?.length})`}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay data-mm-drawer-overlay />
        <Drawer.Content data-mm-drawer-content>
          <div data-mm-drawer-content-wrapper>
            <Drawer.Title>Mocks List</Drawer.Title>
            <ul>
              {mocks.map((mock) => (
                <li key={mock.id} onClick={() => handleRemove(mock.id)}>
                  {mock.id}
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
