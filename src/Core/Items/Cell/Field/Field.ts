import { IHeadquarter } from './Hq/IHeadquarter';
import { IField } from './IField';
import { Cell } from '../Cell';
import { Vehicle } from '../../Unit/Vehicle';
import { CellState } from '../CellState';
import { Item } from '../../Item';
import { Identity } from '../../Identity';

export abstract class Field extends Item implements IField {
	private _onCellStateChanged: { (obj: any, cellState: CellState): void };

	constructor(private _cell: Cell, public Identity: Identity) {
		super();
		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this._cell.OnCellStateChanged.On(this._onCellStateChanged);
		this.SetField();
	}
	GetIdentity(): Identity {
		return this.Identity;
	}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public Destroy(): void {
		super.Destroy();
		this._cell.OnCellStateChanged.Off(this._onCellStateChanged);
	}

	protected GetReactorsPower(hq: IHeadquarter): number {
		const connectedReactors = hq.GetReactors().filter((f) => f.GetInternal().Exist(this.GetCell().Coo()));
		const sum = connectedReactors.map((i) => i.GetPower()).reduce((a, b) => a + b, 0);
		return sum;
	}

	abstract Support(vehicule: Vehicle): void;
	abstract IsDesctrutible(): boolean;
	abstract IsBlocking(): boolean;
	public SetPowerUp(vehicule: Vehicle): void {}
	GetCell(): Cell {
		return this._cell;
	}

	public SetField(): void {
		const currentField = this._cell.GetField();
		if (currentField) {
			if (this.constructor.name === currentField.constructor.name) {
				throw `Cannot replace field with another same type field`;
			}
			(<any>currentField).Destroy();
		}

		this._cell.SetField(this);
		this._cell.OnFieldChanged.Invoke(this, this._cell);
	}
}
