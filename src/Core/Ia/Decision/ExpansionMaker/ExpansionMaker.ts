import { IExpansionMaker } from './IExpansionMaker';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Brain } from '../Brain';
import { Area } from '../Utils/Area';
import { GameSettings } from '../../../Framework/GameSettings';
import { AreaDecisionMaker } from '../Area/AreaDecisionMaker';
import { IaArea } from '../Utils/IaArea';
import { AreaSearch } from '../Utils/AreaSearch';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class ExpansionMaker implements IExpansionMaker {
	constructor(private _hq: Headquarter, private _global: Brain, private _areaSearch: AreaSearch) {}

	public Expand(): void {
		if (15 <= this._hq.GetAmount() && this._global.AreaDecisions.filter((a) => a.Area.HasFreeFields()).length < 3) {
			const area = this.FindArea();
			if (!isNullOrUndefined(area)) {
				if (GameSettings.TankPrice <= this._hq.GetAmount()) {
					this.CreateArea(area);
				}
			}
		}
	}

	public CreateArea(area: Area): void {
		this._global.Areas.splice(this._global.Areas.indexOf(area), 1);
		const areaDecision = new AreaDecisionMaker(
			this._hq,
			new IaArea(this._hq, area, this._global, this._areaSearch)
		);
		this._global.AreaDecisions.push(areaDecision);
		this._global.CellAreas.Add(area.GetCentralCell().Coo(), areaDecision);
	}

	public RemoveArea(area: Area): void {
		const decisionMaker = this._global.CellAreas.Get(area.GetCentralCell().Coo());
		decisionMaker.Destroy();
		this._global.CellAreas.Remove(area.GetCentralCell().Coo());
	}

	private FindArea(): Area {
		if (this._global.Areas.length === 0) {
			return null;
		}

		if (0 === this._global.AreaDecisions.length) {
			const diamondCell = this._global.GetDiamond().GetCell();
			return this._global.Areas.filter((a) => a.GetCentralCell() === diamondCell)[0];
		}

		return this.GetClosestArea();
	}

	private GetClosestArea() {
		let currentArea = this._global.Areas[0];
		let currentCost = this._hq
			.GetCell()
			.GetCentralPoint()
			.GetDistance(currentArea.GetCentralCell().GetCentralPoint());
		this._global.Areas.forEach((area) => {
			let cost = this._hq.GetCell().GetCentralPoint().GetDistance(area.GetCentralCell().GetCentralPoint());
			if (cost < currentCost) {
				currentArea = area;
				currentCost = cost;
			}
		});
		return currentArea;
	}
}
