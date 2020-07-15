import { isNullOrUndefined } from 'util';
import { IDoable } from './../IDoable';
import { SquadRoad } from './SquadRoad';
import { SmartSimpleOrder } from '../../Order/SmartSimpleOrder';
import { Tank } from '../../../Items/Unit/Tank';
import { Cell } from '../../../Items/Cell/Cell';
import { MapObserver } from '../MapObserver';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { AliveItem } from '../../../Items/AliveItem';

export class Squad implements IDoable {
	private _tanks: Tank[] = new Array<Tank>();
	private _steps: Cell[];
	private _target: Cell;
	private _currentStep: Cell;
	public IsDone: boolean = false;
	public constructor(private _road: SquadRoad, private _mapObserver: MapObserver, private _hq: Headquarter) {}

	public Do(): void {
		if (isNullOrUndefined(this._target)) {
			this.IsDone = true;
			return;
		}

		if (isNullOrUndefined(this._currentStep)) {
			this._steps = this._road.GetTargets(this._tanks, this._target);
			if (0 < this._steps.length) {
				this._currentStep = this._steps.shift();
				this._tanks.forEach((t) => this.SetTank(t));
			} else {
				this.IsDone = true;
			}
		} else {
			if (this._tanks.some((t) => t === this._currentStep.GetOccupier())) {
				this._currentStep = null;
			} else {
				this._tanks.forEach((t) => {
					if (!t.HasOrder()) {
						this.SetTank(t);
					}
				});
			}
		}
	}

	private SetTank(t: Tank) {
		t.SetOrder(new SmartSimpleOrder(this._currentStep, t));
		if (this._currentStep.GetField() instanceof AliveItem) {
			const f = (this._currentStep.GetField() as unknown) as AliveItem;
			if (f.IsEnemy(t)) {
				t.SetMainTarget(f);
			}
		}
	}

	public SetTarget(): void {
		this._target = this._mapObserver.GetShortestImportantFields(this._hq.GetCell());
	}

	GetTankCount(): number {
		return this._tanks.length;
	}
	public AddTank(tank: Tank): void {
		this._tanks.push(tank);
	}
}
