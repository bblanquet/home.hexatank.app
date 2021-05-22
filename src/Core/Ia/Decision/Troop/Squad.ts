import { Tank } from './../../../Items/Unit/Tank';
import { ISquadTarget } from './Target/ISquadTarget';
import { IDoable } from './../IDoable';
import { SquadRoad } from './SquadRoad';
import { MapObserver } from '../MapObserver';
import { GlobalIa } from '../GlobalIa';
import { CellHelper } from '../../../Items/Cell/CellHelper';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class Squad implements IDoable {
	private _tanks: Tank[] = new Array<Tank>();
	private _targets: ISquadTarget[];
	private _mainTarget: ISquadTarget;
	private _currentTarget: ISquadTarget;
	public constructor(private _road: SquadRoad, private _mapObserver: MapObserver, private _kg: GlobalIa) {}

	HasTank(): boolean {
		return 0 < this._tanks.length;
	}

	public Drop(): Tank {
		return this._tanks.shift();
	}

	public IsDone(): boolean {
		return this._tanks.length === 0;
	}

	public Update(): void {
		if (this._mainTarget.IsDone()) {
			this.DispatchAll();
		} else {
			if (this.HasNoTarget()) {
				if (!this._mainTarget.IsDone()) {
					this._targets = this._road.GetTargets(this._tanks, this._mainTarget);
					if (0 < this._targets.length) {
						this._currentTarget = this._targets.shift();
					}
				}
			} else {
				this._tanks.forEach((tank) => {
					this._currentTarget.Attack(tank);
				});
			}
		}
	}

	private HasNoTarget() {
		return isNullOrUndefined(this._currentTarget);
	}

	private DispatchAll() {
		this._tanks.forEach((t) => {
			this.Dispatch(t);
		});
	}

	private Dispatch(tank: Tank): void {
		const candidates = this._kg
			.GetKingdomAreas()
			.Values()
			.filter((a) => 0 < a.GetFreeUnitCellCount())
			.map((c) => c.GetCentralCell());
		if (0 < candidates.length) {
			const closestCell = CellHelper.GetClosest(candidates, tank.GetCurrentCell());
			const area = this._kg.GetKingdomAreas().Get(closestCell.Coo());
			area.AddTroop(tank, area.GetRandomFreeUnitCell());
		}
	}

	public SetMainTarget(): boolean {
		this._mainTarget = this._mapObserver.GetShortestImportantFields(this._kg.Hq.GetCell());
		return this._mainTarget !== null;
	}

	GetTankCount(): number {
		return this._tanks.length;
	}
	public AddTank(tank: Tank): void {
		this._tanks.push(tank);
	}
}
