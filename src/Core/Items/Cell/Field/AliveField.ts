import { AliveItem } from '../../AliveItem';
import { IField } from './IField';
import { Vehicle } from '../../Unit/Vehicle';
import { CellState } from '../CellState';
import { Cell } from '../Cell';
import { Identity } from '../../Identity';

export abstract class AliveField extends AliveItem implements IField {
	private _onCellStateChanged: any = this.HandleCellStateChanged.bind(this);

	constructor(private _cell: Cell, public Identity: Identity) {
		super();
		this._cell.OnCellStateChanged.On(this._onCellStateChanged);
	}

	GetIdentity(): Identity {
		return this.Identity;
	}

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

	SetPowerUp(vehicule: Vehicle): void {}
	abstract Support(vehicule: Vehicle): void;
	abstract IsDesctrutible(): boolean;
	abstract IsBlocking(): boolean;
}
