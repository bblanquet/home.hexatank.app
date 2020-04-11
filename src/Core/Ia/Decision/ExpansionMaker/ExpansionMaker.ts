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
	constructor(private _hq: Headquarter, private _decision: Kingdom, private _cells: CellContext<Cell>) {}

	public Expand(): void {
		const area = this.FindArea();
		if (!isNullOrUndefined(area)) {
			if (GameSettings.TankPrice <= this._hq.GetAmount()) {
				this.CreateArea(area);
			}
		}
	}

	private CreateArea(area: Area) {
		this._decision.RemainingAreas.splice(this._decision.RemainingAreas.indexOf(area), 1);
		const areaDecision = new BasicAreaDecisionMaker(new KingdomArea(this._hq, area, this._decision), this._cells);
		this._decision.AreaDecisions.push(areaDecision);
		this._decision.CellAreas.Add(area.GetCentralCell().GetCoordinate().ToString(), areaDecision);
		this.Log(areaDecision);
	}

	private FindArea(): Area {
		if (this._decision.RemainingAreas.length === 0) {
			return null;
		}

		if (0 === this._decision.AreaDecisions.length) {
			const diamondCell = this._decision.Diamond.GetCell();
			return this._decision.RemainingAreas.filter((a) => a.GetCentralCell() === diamondCell)[0];
		}

		return this.GetClosestArea();
	}

	private GetClosestArea() {
		let currentArea = this._decision.RemainingAreas[0];
		let currentCost = this.GetCost(
			this._hq.GetCell().GetCentralPoint(),
			currentArea.GetCentralCell().GetCentralPoint()
		);
		this._decision.RemainingAreas.forEach((area) => {
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
