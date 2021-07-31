import { IExpansionMaker } from './IExpansionMaker';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Brain } from '../Brain';
import { Area } from '../Utils/Area';
import { GameSettings } from '../../../Framework/GameSettings';
import { BrainArea } from '../Utils/BrainArea';
import { AreaSearch } from '../Utils/AreaSearch';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { Cell } from '../../../Items/Cell/Cell';
import { AStarEngine } from '../../AStarEngine';

export class DiamondExpansionMaker implements IExpansionMaker {
	private _diamondRoad: Area[];

	constructor(
		private _hq: Headquarter,
		private _global: Brain,
		private _areaSearch: AreaSearch,
		private _parallelism: number
	) {}

	private GetDiamondRoad(global: Brain): Area[] {
		const departure = global.Hq.GetCell();
		const arrival = global.GetDiamond().GetCell();
		const engine = new AStarEngine<Cell>((c: Cell) => c !== null, (c: Cell) => 1);
		const road = engine.GetPath(departure, arrival);
		const result = global.Areas.filter((a) => road.some((c) => a.Contains(c)));
		//excule diamond & hq areas;
		return result.filter((r) => r.Contains(arrival));
	}

	public Expand(): void {
		if (this._global.BrainAreas.filter((a) => a.HasFreeFields()).length < this._parallelism) {
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
		const areaDecision = new BrainArea(this._hq, area, this._global, this._areaSearch);
		this._global.BrainAreas.push(areaDecision);
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

		if (!this._diamondRoad) {
			this._diamondRoad = this.GetDiamondRoad(this._global);
		}

		if (this._diamondRoad.some((a) => !this._global.IsConquested(a))) {
			const a = this._diamondRoad.find((a) => !this._global.IsConquested(a));
			return a;
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
