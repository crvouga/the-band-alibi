import { GridContainer } from "./grid-container";
import { GridItem } from "./grid-item";

export const ItemGrid = <TItem,>({
  items,
  renderItem,
  getItemKey,
}: {
  items: TItem[];
  renderItem: (item: TItem, index: number) => React.ReactNode;
  getItemKey: (item: TItem) => string;
}) => {
  return (
    <GridContainer>
      {items.map((item, index) => (
        <GridItem key={getItemKey(item)}>{renderItem(item, index)}</GridItem>
      ))}
    </GridContainer>
  );
};