import { CellHelper } from './../../Items/Cell/CellHelper';
import { ReactorSquadTarget } from './Troop/Target/ReactorSquadTarget';
import { AliveSquadTarget } from './Troop/Target/HqSquadTarget';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { ISquadTarget } from './Troop/Target/ISquadTarget';
import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { Area } from './Utils/Area';
import { Cell } from '../../Items/Cell/Cell';

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
		const areas = this.FoeAreas.filter((a) => a.GetStatus().HasFields([ ReactorField.name, Headquarter.name ]));
		if (0 === areas.length) {
			return [];
		}

		return areas
			.map((a) => a.GetStatus().GetKindCells([ ReactorField.name, Headquarter.name ]))
			.reduce((x, y) => x.concat(y));
	}

	public GetShortestImportantFields(origin: Cell): ISquadTarget {
		const cells = this.GetImportantFields();
		if (cells.length === 0) {
			return null;
		}

		const cell = CellHelper.GetClosest(cells, origin);
		if (cell.GetField() instanceof ReactorField) {
			return new ReactorSquadTarget(cell, this._hq);
		} else {
			return new AliveSquadTarget(this._hq);
		}
	}
}