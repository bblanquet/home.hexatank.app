import { Cell } from '../../Items/Cell/Cell';
import { isNullOrUndefined } from 'util';
import { AliveItem } from '../../Items/AliveItem';

export class Area {
	constructor(private _centralCell: Cell) {}

	public GetCentralCell(): Cell {
		return this._centralCell;
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
