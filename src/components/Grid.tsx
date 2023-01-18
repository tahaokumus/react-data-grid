import React, { useState } from 'react';
import DataEditor, {
	DataEditorProps,
	GridCellKind,
	GridColumn,
	NumberCell
} from '@glideapps/glide-data-grid';

const colCount = 300;
const rowCount = 30001;

function createData(): Array<number> {
	const arr = [] as Array<number>;
	for (let col = 0; col < colCount; col++) {
		for (let row = 1; row < rowCount; row++) {
			arr.push(row * (col + 1));
		}
	}

	return arr;
}

const tableData = createData();

function getTableData(col: number, row: number) {
	return tableData[row * rowCount + col].toString();
}

export default function Grid() {
	const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, data: '' });

	const getData = React.useCallback<DataEditorProps['getCellContent']>(
		([col, row]: readonly [number, number]) => {
			const data = tableData[row * rowCount + col];
			return {
				kind: GridCellKind.Number,
				allowOverlay: true,
				data,
				displayData: data.toString()
			};
		},
		[]
	);

	const cols = React.useMemo<GridColumn[]>(() => {
		const arr = [];
		for (let i = 0; i < 300; i++) {
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
					getCellContent={getData}
					width={'100vw'}
					height={'100vh'}
					columns={cols}
					rows={30000}
					onCellContextMenu={([col, row]: readonly [number, number], event) => {
						console.log(event);
						setContextMenu({
							x: event.bounds.x + event.localEventX,
							y: event.bounds.y + event.localEventY,
							data: getTableData(col, row)
						});
					}}
					onCellEdited={([col, row]: readonly [number, number], newValue) => {
						const val = newValue as NumberCell;
						console.log(newValue);
						tableData[row * rowCount + col] = val.data ?? 0;
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
