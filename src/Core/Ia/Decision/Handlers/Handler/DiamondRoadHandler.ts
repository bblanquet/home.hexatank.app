import { RoadField } from './../../../../Items/Cell/Field/Bonus/RoadField';
import { BasicField } from './../../../../Items/Cell/Field/BasicField';
import { Brain } from '../../Brain';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Cell } from '../../../../Items/Cell/Cell';
import { AStarEngine } from '../../../AStarEngine';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { GameSettings } from '../../../../Framework/GameSettings';

export class DiamondRoadHandler implements IHandler {
	constructor(private _global: Brain, private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		if (!request.Area.HasRoadField()) {
			const cells = this.GetCells(this._global);
			const areaCells = cells.filter((c) => request.Area.GetSpot().Contains(c));
			const price = areaCells.length * GameSettings.FieldPrice;
			if (price < this._hq.GetAmount()) {
				areaCells.forEach((cell) => {
					if (cell.GetField() instanceof BasicField) {
						new RoadField(cell, this._hq);
						this._hq.Buy(GameSettings.FieldPrice);
					}
				});
			}
		}
	}

	private GetCells(global: Brain): Cell[] {
		const departure = global.Hq.GetCell();
		const arrival = global.GetDiamond().GetCell();
		const engine = new AStarEngine<Cell>((c: Cell) => c !== null, (c: Cell) => 1);
		return engine.GetPath(departure, arrival);
	}
}
