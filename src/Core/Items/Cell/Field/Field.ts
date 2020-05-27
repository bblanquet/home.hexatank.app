import { Headquarter } from './Hq/Headquarter';
import { IField } from './IField';
import { Cell } from '../Cell';
import { CellState } from '../CellState';
import { Item } from '../../Item';
import { Vehicle } from '../../Unit/Vehicle';
import { AliveItem } from '../../AliveItem';

export abstract class Field extends Item implements IField {
	private _onCellStateChanged: { (obj: any, cellState: CellState): void };

	constructor(private _cell: Cell) {
		super();
		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this._cell.CellStateChanged.On(this._onCellStateChanged);
	}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public Destroy(): void {
		super.Destroy();
		this._cell.CellStateChanged.Off(this._onCellStateChanged);
	}

	protected GetReactorsPower(hq: Headquarter): number {
		const connectedReactors = hq.GetReactors().filter((f) => f.GetInternal().Exist(this.GetCell().GetCoordinate()));
		const sum = connectedReactors.map((i) => i.GetPower()).reduce((a, b) => a + b, 0);
		return sum;
	}

	abstract Support(vehicule: Vehicle): void;
	abstract IsDesctrutible(): boolean;
	abstract IsBlocking(): boolean;
	GetCell(): Cell {
		return this._cell;
	}
}
