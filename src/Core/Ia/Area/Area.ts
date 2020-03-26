import { Cell } from '../../Items/Cell/Cell';
import { isNullOrUndefined } from 'util';
import { AliveItem } from '../../Items/AliveItem';

export class Area {
	constructor(private _centercell: Cell) {}

	public GetCentralCell(): Cell {
		return this._centercell;
	}

	public GetEnemycell(v: AliveItem): Cell[] {
		const result = new Array<Cell>();
		const cells = this._centercell.GetAllNeighbourhood().map((c) => <Cell>c).filter((c) => !isNullOrUndefined(c));
		cells.push(this.GetCentralCell());
		cells.forEach((cell) => {
			if (cell.ContainsEnemy(v)) {
				result.push(cell);
			}
		});
		return result;
	}

	public GetAvailablecell(): Cell[] {
		const cells = this._centercell
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
		const cells = this._centercell.GetAllNeighbourhood().map((c) => <Cell>c);
		cells.push(this._centercell);
		cells.forEach((cell) => {
			if (cell.ContainsAlly(v)) {
				enemyCount += 1;
			}
		});
		return enemyCount;
	}

	public GetEnemyCount(v: AliveItem): number {
		let enemyCount = 0;
		const cells = this._centercell.GetAllNeighbourhood().map((c) => <Cell>c);
		cells.push(this._centercell);
		cells.forEach((cell) => {
			if (cell.ContainsEnemy(v)) {
				enemyCount += 1;
			}
		});
		return enemyCount;
	}
}
