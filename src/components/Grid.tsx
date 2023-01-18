import React, { useState } from 'react';
import DataEditor, {
	DataEditorProps,
	GridCellKind,
	GridColumn
} from '@glideapps/glide-data-grid';

export default function Grid() {
	const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, data: '' });

	const getData = React.useCallback<DataEditorProps['getCellContent']>(
		(cell) => ({
			kind: GridCellKind.Text,
			allowOverlay: true,
			readonly: true,
			data: `${cell[0]},${cell[1]}`,
			displayData: `${cell[0]},${cell[1]}`
		}),
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
					onCellContextMenu={(cell, event) => {
						console.log(cell, event);
						setContextMenu({
							x: event.bounds.x + event.localEventX,
							y: event.bounds.y + event.localEventY,
							data: cell.toString()
						});
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
