import { IExpansionMaker } from './IExpansionMaker';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Kingdom } from '../Kingdom';
import { Area } from '../Utils/Area';
import { Point } from '../../../Utils/Geometry/Point';
import { isNullOrUndefined } from 'util';
import { GameSettings } from '../../../Framework/GameSettings';
import { AreaDecisionMaker } from '../Area/AreaDecisionMaker';
import { KingdomArea } from '../Utils/KingdomArea';
import { AreaSearch } from '../Utils/AreaSearch';

export class ExpansionMaker implements IExpansionMaker {
	constructor(private _hq: Headquarter, private _kingdom: Kingdom, private _areaSearch: AreaSearch) {}

	public Expand(): void {
		if (this._kingdom.AreaDecisions.filter((a) => a.Area.HasFreeFields()).length < 3) {
			const area = this.FindArea();
			if (!isNullOrUndefined(area)) {
				if (GameSettings.TankPrice <= this._hq.GetAmount()) {
					this.CreateArea(area);
				}
			}
		}
	}

	public CreateArea(area: Area): void {
		this._kingdom.Areas.splice(this._kingdom.Areas.indexOf(area), 1);
		const areaDecision = new AreaDecisionMaker(
			this._hq,
			new KingdomArea(this._hq, area, this._kingdom, this._areaSearch)
		);
		this._kingdom.AreaDecisions.push(areaDecision);
		this._kingdom.CellAreas.Add(area.GetCentralCell().Coo(), areaDecision);
		this.Log(areaDecision);
	}

	public RemoveArea(area: Area): void {
		const decisionMaker = this._kingdom.CellAreas.Get(area.GetCentralCell().Coo());
		decisionMaker.Destroy();
		this._kingdom.CellAreas.Remove(area.GetCentralCell().Coo());
	}

	private FindArea(): Area {
		if (this._kingdom.Areas.length === 0) {
			return null;
		}

		if (0 === this._kingdom.AreaDecisions.length) {
			const diamondCell = this._kingdom.GetDiamond().GetCell();
			return this._kingdom.Areas.filter((a) => a.GetCentralCell() === diamondCell)[0];
		}

		return this.GetClosestArea();
	}

	private GetClosestArea() {
		let currentArea = this._kingdom.Areas[0];
		let currentCost = this.GetCost(
			this._hq.GetCell().GetCentralPoint(),
			currentArea.GetCentralCell().GetCentralPoint()
		);
		this._kingdom.Areas.forEach((area) => {
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

	private Log(areaDecision: AreaDecisionMaker) {
		console.log(
			`%c [NEW AREA]  Q:${areaDecision.Area.GetSpot().GetCentralCell().GetCoordinate()
				.Q} R:${areaDecision.Area.GetSpot().GetCentralCell().GetCoordinate().R}}`,
			'font-weight:bold;color:green;'
		);
	}
}
