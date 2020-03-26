import { AliveItem } from '../../Items/AliveItem';
import { IField } from './IField';
import { Cell } from '../Cell';
import { CellState } from '../CellState';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';

export abstract class AliveField extends AliveItem implements IField {
	abstract Support(vehicule: Vehicle): void;
	abstract IsDesctrutible(): boolean;
	abstract IsBlocking(): boolean;

	private _onCellStateChanged: { (obj: any, cellState: CellState): void };

	constructor(private _cell: Cell) {
		super();
		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this._cell.CellStateChanged.on(this._onCellStateChanged);
	}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
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
		this._cell.CellStateChanged.off(this._onCellStateChanged);
	}
}
