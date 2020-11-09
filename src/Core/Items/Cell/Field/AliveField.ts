import { AliveItem } from '../../AliveItem';
import { IField } from './IField';
import { Vehicle } from '../../Unit/Vehicle';
import { CellState } from '../CellState';
import { Cell } from '../Cell';

export abstract class AliveField extends AliveItem implements IField {
	abstract Support(vehicule: Vehicle): void;
	abstract IsDesctrutible(): boolean;
	abstract IsBlocking(): boolean;

	private _onCellStateChanged: { (obj: any, cellState: CellState): void };

	constructor(private _cell: Cell) {
		super();
		this._onCellStateChanged = this.HandleCellStateChanged.bind(this);
		this._cell.OnCellStateChanged.On(this._onCellStateChanged);
	}
	SetPowerUp(vehicule: Vehicle): void {}

	protected HandleCellStateChanged(obj: any, cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState === CellState.Visible;
		});
	}

	public GetCell(): Cell {
		return this._cell;
	}

	public GetCurrentCell(): Cell {
		return this._cell;
	}

	public Destroy(): void {
		super.Destroy();
		this._cell.OnCellStateChanged.Off(this._onCellStateChanged);
	}
}
