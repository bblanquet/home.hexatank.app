import { ReactorField } from './../../Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { Area } from './Utils/Area';
import { Cell } from '../../Items/Cell/Cell';
import { DistanceHelper } from '../../Items/Unit/MotionHelpers/DistanceHelper';
import { Groups } from './../../Utils/Collections/Groups';
import { Reactor } from '../../Items/Cell/Field/Bonus/Reactor';

export class MapObserver {
	public NeutralAreas: Area[];
	public FoeAreas: Area[];

	constructor(private _area: Area[], private _hq: Headquarter) {}

	public Observe(): void {
		this.NeutralAreas = [];
		this.FoeAreas = [];
		this._area.forEach((a) => {
			if (a.GetStatus().HasFoesOf(this._hq)) {
				this.FoeAreas.push(a);
			} else if (a.GetStatus().IsNeutral()) {
				this.NeutralAreas.push(a);
			}
		});
	}

	public GetImportantFields(): Cell[] {
		this.Observe();
		const areas = this.FoeAreas.filter((a) => a.GetStatus().HasFields([ Reactor.name, Headquarter.name ]));
		if (0 === areas.length) {
			return [];
		}

		return areas
			.map((a) => a.GetStatus().GetKindCells([ Reactor.name, Headquarter.name ]))
			.reduce((x, y) => x.concat(y));
	}

	public GetShortestImportantFields(cell: Cell): Cell {
		const result = this.GetImportantFields();
		if (result.length === 0) {
			return null;
		}
		const cellByDist = this.GetCellByDistance(result, cell);
		const closestCell = Math.min(...cellByDist.Keys().map((k) => +k));
		return cellByDist.Get(closestCell.toString())[0];
	}

	private GetCellByDistance(candidates: Cell[], source: Cell): Groups<Cell> {
		const groups = new Groups<Cell>();
		candidates.forEach((candidate) => {
			groups.Add(this.GetDistance(source, candidate).toString(), candidate);
		});
		return groups;
	}

	private GetDistance(source: Cell, target: Cell): number {
		return DistanceHelper.GetDistance(source.GetCoordinate(), target.GetCoordinate());
	}
}
