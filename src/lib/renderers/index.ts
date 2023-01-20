import StyledTextCellRenderer,  { StyledTextCell } from '@/lib/renderers/StyledTextCell';

const cells = [
    StyledTextCellRenderer,
];

export {
    StyledTextCellRenderer as StyledTextCell,
    cells as allCells,
};

export type {
    StyledTextCell as StyledTextCellType,
};