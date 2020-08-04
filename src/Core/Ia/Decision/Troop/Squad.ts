import { Headquarter } from './../../../Items/Cell/Field/Hq/Headquarter';
import { Tank } from './../../../Items/Unit/Tank';
import { ISquadTarget } from './Target/ISquadTarget';
import { isNullOrUndefined } from 'util';
import { IDoable } from './../IDoable';
import { SquadRoad } from './SquadRoad';
import { SmartSimpleOrder } from '../../Order/SmartSimpleOrder';
import { Cell } from '../../../Items/Cell/Cell';
import { MapObserver } from '../MapObserver';
import { AliveItem } from '../../../Items/AliveItem';
import { Kingdom } from '../Kingdom';
import { CellHelper } from '../../../Items/Cell/CellHelper';

export class Squad implements IDoable {
	private _tanks: Tank[] = new Array<Tank>();
	private _steps: Cell[];
	private _target: ISquadTarget;
	private _currentStep: Cell;
	public IsDone: boolean = false;
	public constructor(private _road: SquadRoad, private _mapObserver: MapObserver, private _kg: Kingdom) {}

	public Do(): void {
		if (this._target.IsDone()) {
			this.IsDone = true;
			return;
		}

		if (isNullOrUndefined(this._currentStep)) {
			if (this._target.IsDone()) {
				this.SetDone();
			} else {
				this._steps = this._road.GetTargets(this._tanks, this._target.GetCell());
				if (0 < this._steps.length) {
					this._currentStep = this._steps.shift();
					this._tanks.forEach((t) => t.CancelOrder());
				} else {
					this.SetDone();
				}
			}
		} else {
			if (this._tanks.some((t) => t === this._currentStep.GetOccupier())) {
				this._currentStep = null;
			} else {
				this._tanks.forEach((t) => {
					this.SetOrder(t);
					//if (!t.HasOrder()) {}
				});
			}
		}
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

	private SetOrder(t: Tank) {
		t.SetOrder(new SmartSimpleOrder(this._currentStep, t));
		if (this._currentStep.GetField() instanceof AliveItem) {
			const f = (this._currentStep.GetField() as unknown) as AliveItem;
			if (f.IsEnemy(t)) {
				t.SetMainTarget(f);
			}
		}
	}

	public SetTarget(): boolean {
		this._target = this._mapObserver.GetShortestImportantFields(this._kg.Hq.GetCell());
		return this._target !== null;
	}

	GetTankCount(): number {
		return this._tanks.length;
	}
	public AddTank(tank: Tank): void {
		this._tanks.push(tank);
	}
}
