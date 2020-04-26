import { IExpansionMaker } from './IExpansionMaker';
import { Headquarter } from '../../../Items/Cell/Field/Headquarter';
import { Kingdom } from '../Kingdom';
import { Area } from '../Utils/Area';
import { Point } from '../../../Utils/Geometry/Point';
import { isNullOrUndefined } from 'util';
import { GameSettings } from '../../../Framework/GameSettings';
import { BasicAreaDecisionMaker } from '../Area/BasicAreaDecisionMaker';
import { KingdomArea } from '../Utils/KingdomArea';
import { CellContext } from '../../../Items/Cell/CellContext';
import { Cell } from '../../../Items/Cell/Cell';

export class ExpansionMaker implements IExpansionMaker {
	constructor(private _hq: Headquarter, private _kingdom: Kingdom, private _cells: CellContext<Cell>) {}

	public Expand(): void {
		if (!this._kingdom.AreaDecisions.some((a) => a.Area.HasFreeFields())) {
			const area = this.FindArea();
			if (!isNullOrUndefined(area)) {
				if (GameSettings.TankPrice <= this._hq.GetAmount()) {
					this.CreateArea(area);
				}
			}
		}
	}

	private CreateArea(area: Area) {
		this._kingdom.RemainingAreas.splice(this._kingdom.RemainingAreas.indexOf(area), 1);
		const areaDecision = new BasicAreaDecisionMaker(new KingdomArea(this._hq, area, this._kingdom), this._cells);
		this._kingdom.AreaDecisions.push(areaDecision);
		this._kingdom.CellAreas.Add(area.GetCentralCell().GetCoordinate().ToString(), areaDecision);
		this.Log(areaDecision);
	}

	private FindArea(): Area {
		if (this._kingdom.RemainingAreas.length === 0) {
			return null;
		}

		if (0 === this._kingdom.AreaDecisions.length) {
			const diamondCell = this._kingdom.GetDiamond().GetCell();
			return this._kingdom.RemainingAreas.filter((a) => a.GetCentralCell() === diamondCell)[0];
		}

		return this.GetClosestArea();
	}

	private GetClosestArea() {
		let currentArea = this._kingdom.RemainingAreas[0];
		let currentCost = this.GetCost(
			this._hq.GetCell().GetCentralPoint(),
			currentArea.GetCentralCell().GetCentralPoint()
		);
		this._kingdom.RemainingAreas.forEach((area) => {
			let cost = this.GetCost(this._hq.GetCell().GetCentralPoint(), area.GetCentralCell().GetCentralPoint());
			if (cost < currentCost) {
				currentArea = area;
				currentCost = cost;
			}
		});
		return currentArea;
	}

	private GetCost(a: Point, b: Point): number {
		return Math.sqrt(Math.pow(b.X - a.X, 2)) + Math.sqrt(Math.pow(b.Y - a.Y, 2));
	}

	private Log(areaDecision: BasicAreaDecisionMaker) {
		console.log(
			`%c [NEW AREA]  Q:${areaDecision.Area.GetSpot().GetCentralCell().GetCoordinate()
				.Q} R:${areaDecision.Area.GetSpot().GetCentralCell().GetCoordinate().R}}`,
			'font-weight:bold;color:green;'
		);
	}
}
