import { AliveItem } from '../../AliveItem';
import { IField } from './IField';
import { Vehicle } from '../../Unit/Vehicle';
import { CellState } from '../CellState';
import { Cell } from '../Cell';
import { PeerHandler } from '../../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../../Components/Network/PacketKind';

export abstract class AliveField extends AliveItem implements IField {
	abstract Support(vehicule: Vehicle): void;
	abstract IsDesctrutible(): boolean;
	abstract IsBlocking(): boolean;

	private _onCellStateChanged: { (obj: any, cellState: CellState): void };

	constructor(private _cell: Cell) {
		super();
		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this._cell.CellStateChanged.On(this._onCellStateChanged);
	}
	SetPowerUp(vehicule: Vehicle): void {}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
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
		PeerHandler.SendMessage(PacketKind.Destroyed, {
			cell: this._cell.GetCoordinate(),
			Name: 'field'
		});
		super.Destroy();
		this._cell.CellStateChanged.Off(this._onCellStateChanged);
	}
}
