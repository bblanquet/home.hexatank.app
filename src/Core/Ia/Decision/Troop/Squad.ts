import { Headquarter } from './../../../Items/Cell/Field/Hq/Headquarter';
import { Tank } from './../../../Items/Unit/Tank';
import { ISquadTarget } from './Target/ISquadTarget';
import { isNullOrUndefined } from 'util';
import { IDoable } from './../IDoable';
import { SquadRoad } from './SquadRoad';
import { MapObserver } from '../MapObserver';
import { Kingdom } from '../Kingdom';
import { CellHelper } from '../../../Items/Cell/CellHelper';

export class Squad implements IDoable {
	private _tanks: Tank[] = new Array<Tank>();
	private _targets: ISquadTarget[];
	private _mainTarget: ISquadTarget;
	private _currentTarget: ISquadTarget;
	public IsDone: boolean = false;
	public constructor(private _road: SquadRoad, private _mapObserver: MapObserver, private _kg: Kingdom) {}

	HasTank(): boolean {
		return 0 < this._tanks.length;
	}

	public Drop(): Tank {
		return this._tanks.shift();
	}

	public Do(): void {
		if (this._mainTarget.IsDone() || this._tanks.length === 0) {
			this.IsDone = true;
			this.SetDone();
			return;
		}

		if (this.HasNoTarget()) {
			if (!this._mainTarget.IsDone()) {
				this._targets = this._road.GetTargets(this._tanks, this._mainTarget);
				if (0 < this._targets.length) {
					this._currentTarget = this._targets.shift();
					this._tanks.forEach((tank) => {
						this._currentTarget.Attack(tank);
					});
				}
			}
		}
	}

	private HasNoTarget() {
		return isNullOrUndefined(this._currentTarget);
	}

	private SetDone() {
		this.IsDone = true;
		this._tanks.forEach((t) => {
			this.Dispatch(t, this._kg.Hq);
		});
	}

	private Dispatch(tank: Tank, hq: Headquarter): void {
		const candidates = this._kg
			.GetKingdomAreas()
			.Values()
			.filter((a) => 0 < a.GetFreeUnitCellCount())
			.map((c) => c.GetCentralCell());
		const closestCell = CellHelper.GetClosest(candidates, tank.GetCurrentCell());
		const area = this._kg.GetKingdomAreas().Get(closestCell.GetCoordinate().ToString());
		area.AddTroop(tank, area.GetRandomFreeUnitCell());
	}

	public SetTarget(): boolean {
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
