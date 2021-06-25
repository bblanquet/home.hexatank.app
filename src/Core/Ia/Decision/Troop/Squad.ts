import { Tank } from './../../../Items/Unit/Tank';
import { ISquadTarget } from './Target/ISquadTarget';
import { IDoable } from './../IDoable';
import { MapObserver } from '../MapObserver';
import { Brain } from '../Brain';
import { CellHelper } from '../../../Items/Cell/CellHelper';
import { TargetMonitoredOrder } from '../../Order/TargetMonitoredOrder';
import * as moment from 'moment';
import { LogKind } from '../../../Utils/Logger/LogKind';
import { StaticLogger } from '../../../Utils/Logger/StaticLogger';

export class Squad implements IDoable {
	private _tanks: Tank[] = new Array<Tank>();
	private _mainTarget: ISquadTarget;
	public constructor(private _mapObserver: MapObserver, private _brain: Brain) {}

	public AddTank(tank: Tank): void {
		this._tanks.push(tank);
	}
	public GetTankCount(): number {
		return this._tanks.length;
	}

	public HasTank(): boolean {
		return 0 < this._tanks.length;
	}

	public Drop(): Tank {
		return this._tanks.shift();
	}

	public IsDone(): boolean {
		return this._tanks.length === 0;
	}

	public Update(): void {
		if (!this._mainTarget || (this._mainTarget && this._mainTarget.IsDone())) {
			if (!this.SetMainTarget()) {
				this.RetreatAll();
			} else {
				this._tanks.forEach((tank) => {
					tank.GiveOrder(new TargetMonitoredOrder(this._mainTarget.GetCell(), tank));
				});
			}
		} else if (this._mainTarget) {
			this._tanks.forEach((tank) => {
				if (!tank.HasOrder()) {
					tank.GiveOrder(new TargetMonitoredOrder(this._mainTarget.GetCell(), tank));
				}
			});
		}
	}

	private RetreatAll() {
		this._tanks.forEach((t) => {
			this.Retreat(t);
		});
	}

	private Retreat(tank: Tank): void {
		const candidates = this._brain
			.GetIaAreaByCell()
			.Values()
			.filter((a) => 0 < a.GetFreeUnitCellCount())
			.map((c) => c.GetCentralCell());
		if (0 < candidates.length) {
			const closestCell = CellHelper.GetClosest(candidates, tank.GetCurrentCell());
			const area = this._brain.GetIaAreaByCell().Get(closestCell.Coo());
			area.AddTroop(tank, area.GetRandomFreeUnitCell());
		}
	}

	public SetMainTarget(): boolean {
		this._mainTarget = this._mapObserver.GetShortestFoe(this._brain.Hq.GetCell());
		const hasTarget = this._mainTarget !== null;
		if (!hasTarget) {
			StaticLogger.Log(LogKind.error, `could not find target`);
		}
		return hasTarget;
	}
}
