import { Headquarter } from '../../../Items/Cell/Field/Headquarter';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { Cell } from '../../../Items/Cell/Cell';
import { isNullOrUndefined } from 'util';
import { AliveItem } from '../../../Items/AliveItem';
import { CellContext } from '../../../Items/Cell/CellContext';
import { AreaSearch } from './AreaSearch';
import { DistanceHelper } from '../../../Items/Unit/MotionHelpers/DistanceHelper';

export class Area {
	private _areaSearch: AreaSearch;
	constructor(private _centralCell: Cell, private _cells: CellContext<Cell>) {
		this._areaSearch = new AreaSearch(this._cells.Keys());
	}

	public GetAroundAreas(): Area[] {
		return this._areaSearch
			.GetExcludedFirstRange(this.GetCentralCell().GetCoordinate())
			.map((coo) => new Area(this._cells.Get(coo), this._cells));
	}

	public HasHq(): boolean {
		const field = this.GetCentralCell().GetField();
		return field instanceof Headquarter;
	}

	public GetDistanceFrom(cell: Cell): number {
		return DistanceHelper.GetDistance(this.GetCentralCell().GetCoordinate(), cell.GetCoordinate());
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
		const cells = this.GetCentralCell().GetAllNeighbourhood().map((c) => <Cell>c);
		cells.push(this.GetCentralCell());
		return cells;
	}

	public GetFoeCells(v: AliveItem): Cell[] {
		const result = new Array<Cell>();
		const cells = this._centralCell.GetAllNeighbourhood().map((c) => <Cell>c).filter((c) => !isNullOrUndefined(c));
		cells.push(this.GetCentralCell());
		cells.forEach((cell) => {
			if (cell.HasEnemy(v)) {
				result.push(cell);
			}
		});
		return result;
	}

	HasFreeCells(): boolean {
		return 0 < this.GetFreeCells().length;
	}

	public GetFreeCells(): Cell[] {
		const cells = this._centralCell
			.GetAllNeighbourhood()
			.map((c) => <Cell>c)
			.filter((c) => !isNullOrUndefined(c) && !c.IsBlocked());
		const centralcell = this.GetCentralCell();
		if (!centralcell.IsBlocked()) {
			cells.push(centralcell);
		}
		return cells;
	}

	public GetAllyCount(v: AliveItem): number {
		let enemyCount = 0;
		const cells = this._centralCell.GetAllNeighbourhood().map((c) => <Cell>c);
		cells.push(this._centralCell);
		cells.forEach((cell) => {
			if (cell.HasAlly(v)) {
				enemyCount += 1;
			}
		});
		return enemyCount;
	}

	public GetFoeCount(v: AliveItem): number {
		let enemyCount = 0;
		const cells = this._centralCell.GetAllNeighbourhood().map((c) => <Cell>c);
		cells.push(this._centralCell);
		cells.forEach((cell) => {
			if (cell.HasEnemy(v)) {
				enemyCount += 1;
			}
		});
		return enemyCount;
	}
}
