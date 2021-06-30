import { AreaStatus } from './AreaStatus';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { Cell } from '../../../Items/Cell/Cell';
import { DistanceHelper } from '../../../Items/Unit/MotionHelpers/DistanceHelper';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { Identity } from '../../../Items/Identity';
import { TypeTranslator } from '../../../Items/Cell/Field/TypeTranslator';

export class Area {
	private _aroudnAreas: Area[];
	private _status: AreaStatus;
	constructor(private _centralCell: Cell) {
		this._status = new AreaStatus(this);
	}

	public SetAround(aroundAreas: Area[]): void {
		this._aroudnAreas = aroundAreas;
	}

	public GetStatus(): AreaStatus {
		return this._status;
	}

	public GetAroundAreas(): Area[] {
		return this._aroudnAreas;
	}

	public GetDistanceFrom(cell: Cell): number {
		return DistanceHelper.GetDistance(this.GetCentralCell().GetHexCoo(), cell.GetHexCoo());
	}

	public HasDiamond(): boolean {
		const field = this.GetCentralCell().GetField();
		return field instanceof Diamond;
	}

	public GetCentralCell(): Cell {
		return this._centralCell;
	}

	public Contains(cell: Cell): boolean {
		return this.GetCells().some((c) => c === cell);
	}

	public GetCells(): Cell[] {
		const cells = this.GetCentralCell().GetNearby();
		cells.push(this.GetCentralCell());
		return cells;
	}

	public GetVehicleFoeCells(id: Identity): Cell[] {
		const result = new Array<Cell>();
		const cells = this._centralCell.GetNearby().filter((c) => !isNullOrUndefined(c));
		cells.push(this.GetCentralCell());
		cells.forEach((cell) => {
			if (TypeTranslator.HasFoeVehicle(cell, id)) {
				result.push(cell);
			}
		});
		return result;
	}

	public GetFreeUnitCells(): Cell[] {
		const cells = this._centralCell.GetNearby().filter((c) => !isNullOrUndefined(c) && !c.IsBlocked());
		const centralcell = this.GetCentralCell();
		if (!centralcell.IsBlocked()) {
			cells.push(centralcell);
		}
		return cells;
	}
}
