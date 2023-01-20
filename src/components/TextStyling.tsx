import React, { useState } from 'react';
import DataEditor, {
	DataEditorProps,
	GridCellKind,
	GridColumn,
	TextCell,
	useCustomCells
} from '@glideapps/glide-data-grid';
import StyledTextCellRenderer, {
	StyledTextCell
} from '@/lib/renderers/StyledTextCell';

const colCount = 10;
const rowCount = 30;

function createData(): Array<Array<string>> {
	const arr = [] as Array<Array<string>>;
	for (let col = 0; col < colCount; col++) {
		arr.push(new Array<string>());
		for (let row = 0; row < rowCount; row++) {
			const data = Math.floor(Math.random() * 100).toString();
			arr[col].push(data);
		}
	}

	return arr;
}

const tableData = createData();

function getTableData(col: number, row: number) {
	return tableData[col][row];
}

const colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'black'];
const fontSizes = ['8px', '12px', '14px', '16px', '24px'];
const fontFamilies = ['serif', 'sans-serif', 'monospace'];
const fontWeights = ['normal', 'bold'];
const bgColors = [
	'rgba(255,0,0,0.2',
	'rgba(0,255,0,0.2)',
	'rgba(0,0,255,0.2)',
	'rgba(128,128,0,0.2)'
];

function getRandomStyle() {
	return {
		color: colors[Math.floor(Math.random() * colors.length)],
		fontSize: fontSizes[Math.floor(Math.random() * fontSizes.length)],
		fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
		fontWeight: fontWeights[Math.floor(Math.random() * fontWeights.length)]
	};
}

function getRandomBgColor() {
	return bgColors[Math.floor(Math.random() * bgColors.length)];
}

export default function Grid() {
	const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, data: '' });
	const cellProps = useCustomCells([StyledTextCellRenderer]);

	const getData = React.useCallback<DataEditorProps['getCellContent']>(
		([col, row]: readonly [number, number]) => {
			const data: StyledTextCell = {
				kind: GridCellKind.Custom,
				allowOverlay: true,
				copyData: 'test',
				data: {
					kind: 'styled-text-cell',
					data: getTableData(col, row),
					readonly: true,
					allowOverlay: true,
					textStyle: getRandomStyle(),
					cellStyle: {
						backgroundColor: getRandomBgColor()
					}
				}
			};

			return data;
		},
		[]
	);

	const cols = React.useMemo<GridColumn[]>(() => {
		const arr = [];
		for (let i = 0; i < colCount; i++) {
			arr.push({
				width: 100,
				title: (i + 1).toString()
			});
		}

		return arr;
	}, []);

	return (
		<>
			<div
				onContextMenu={(e) => {
					e.preventDefault();
				}}
				onClick={(e) => {
					const el = e.target as HTMLElement;
					if (!document.querySelector('#context-menu')?.contains(el)) {
						setContextMenu({ x: 0, y: 0, data: '' });
					}
				}}
			>
				<DataEditor
					{...cellProps}
					getCellContent={getData}
					width={'100vw'}
					height={'100vh'}
					columns={cols}
					rows={rowCount}
					onCellContextMenu={([col, row]: readonly [number, number], event) => {
						console.log(event);
						setContextMenu({
							x: event.bounds.x + event.localEventX,
							y: event.bounds.y + event.localEventY,
							data: getTableData(col, row).toString()
						});
					}}
					onCellEdited={([col, row]: readonly [number, number], newValue) => {
						console.log(newValue);
						const val = newValue as TextCell;
						tableData[col][row] = val.data ?? 0;
					}}
				/>
				{contextMenu.x > 0 && contextMenu.y > 0 && (
					<CellContextMenu
						x={contextMenu.x}
						y={contextMenu.y}
						data={contextMenu.data}
					/>
				)}
			</div>
		</>
	);
}

function CellContextMenu({
	x,
	y,
	data
}: {
	x: number;
	y: number;
	data: string;
}) {
	return (
		<>
			<div
				id='context-menu'
				style={{
					position: 'absolute',
					left: x,
					top: y,
					height: '250px',
					width: '250px',
					backgroundColor: 'gray',
					fontSize: '1.5rem',
					fontFamily: 'sans-serif'
				}}
			>
				<p>RIGHT CLICK MENU</p>
				<p>DATA: {data}</p>
			</div>
		</>
	);
}
