import {
	CustomCell,
	CustomRenderer,
	getMiddleCenterBias,
	GridCellKind,
	BaseGridCell,
	Theme
} from '@glideapps/glide-data-grid';

interface StyledTextCellProps extends BaseGridCell {
	readonly kind: 'styled-text-cell';
	readonly data: string;
	readonly readonly?: boolean;
	readonly allowWrapping?: boolean;
	readonly textStyle?: {
		color?: string;
		fontSize?: string;
		fontFamily?: string;
		fontStyle?: string;
		fontVariant?: string;
		fontWeight?: string;
		fontStretch?: string;
		lineHeight?: number;
	};
  readonly cellStyle?: {
    backgroundColor?: string;
  };
}

export type StyledTextCell = CustomCell<StyledTextCellProps>;

function getFontStyle(cell: StyledTextCell, theme: Theme) {
	const { textStyle } = cell.data;
	const {
		fontSize,
		fontFamily,
		fontStyle,
		fontVariant,
		fontWeight,
		fontStretch,
		lineHeight
	} = textStyle || {};

	return [
		fontStyle || 'normal',
		fontWeight || 'normal',
		fontVariant || 'normal',
		`${fontSize || '12px'}/${lineHeight || theme.lineHeight}`,
		fontStretch || 'normal',
		fontFamily || theme.fontFamily
	].join(' ');
}

const renderer: CustomRenderer<StyledTextCell> = {
	kind: GridCellKind.Custom,
	needsHover: true,
	needsHoverPosition: true,
	isMatch: (c): c is StyledTextCell => {
		return (c.data as any).kind === 'styled-text-cell';
	},
	draw: (args, cell) => {
		const { ctx, rect, theme } = args;
		const { data } = cell.data;

		ctx.font = getFontStyle(cell, theme);
    
    if (cell.data.cellStyle?.backgroundColor) {
      ctx.save()
      ctx.fillStyle = cell.data.cellStyle?.backgroundColor;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.restore()
    }
    
    ctx.fillStyle = cell.data.textStyle?.color || theme.textDark;
		ctx.fillText(
			data,
			rect.x + theme.cellHorizontalPadding,
			rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
		);

		return true;
	}
};

export default renderer;
