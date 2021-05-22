import { IExpansionMaker } from './IExpansionMaker';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { GlobalIa } from '../GlobalIa';
import { Area } from '../Utils/Area';
import { GameSettings } from '../../../Framework/GameSettings';
import { AreaDecisionMaker } from '../Area/AreaDecisionMaker';
import { IaArea } from '../Utils/IaArea';
import { AreaSearch } from '../Utils/AreaSearch';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class ExpansionMaker implements IExpansionMaker {
	constructor(private _hq: Headquarter, private _kingdom: GlobalIa, private _areaSearch: AreaSearch) {}

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
			new IaArea(this._hq, area, this._kingdom, this._areaSearch)
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
		let currentCost = this._hq
			.GetCell()
			.GetCentralPoint()
			.GetDistance(currentArea.GetCentralCell().GetCentralPoint());
		this._kingdom.Areas.forEach((area) => {
			let cost = this._hq.GetCell().GetCentralPoint().GetDistance(area.GetCentralCell().GetCentralPoint());
			if (cost < currentCost) {
				currentArea = area;
				currentCost = cost;
			}
		});
		return currentArea;
	}

	private Log(areaDecision: AreaDecisionMaker) {
		console.log(
			`%c [NEW AREA]  Q:${areaDecision.Area.GetSpot().GetCentralCell().GetHexCoo()
				.Q} R:${areaDecision.Area.GetSpot().GetCentralCell().GetHexCoo().R}}`,
			'font-weight:bold;color:green;'
		);
	}
}
