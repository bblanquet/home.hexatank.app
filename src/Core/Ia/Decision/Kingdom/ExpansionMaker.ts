import { Headquarter } from '../../../Items/Cell/Field/Headquarter';
import { BasicKingdomDecisionMaker } from './BasicKingdomDecisionMaker';
import { Area } from '../../Utils/Area';
import { Point } from '../../../Utils/Geometry/Point';

export class ExpansionMaker {
	constructor(private _hq: Headquarter, private decisionMaker: BasicKingdomDecisionMaker) {}

	public FindArea(): Area {
		if (this.decisionMaker.EmptyAreas.length === 0) {
			return null;
		}

		let currentArea = this.decisionMaker.EmptyAreas[0];
		let currentCost = this.GetCost(
			this._hq.GetCell().GetCentralPoint(),
			currentArea.GetCentralCell().GetCentralPoint()
		);

		this.decisionMaker.EmptyAreas.forEach((area) => {
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
}
