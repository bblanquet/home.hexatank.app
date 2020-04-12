import { isNullOrUndefined } from 'util';
import { ITimer } from '../../../Utils/Timer/ITimer';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { KingdomArea } from '../Utils/KingdomArea';
import { Timer } from '../../../Utils/Timer/Timer';
import { SimpleOrder } from '../../Order/SimpleOrder';

export class TroopDecisionMaker {
	private _changePositionTimer: ITimer;
	private _cancelOrderTimer: ITimer;

	private readonly IsIdle = !this.Tank.IsExecutingOrder() && !this.Tank.HasPendingOrder();
	private readonly IsPratrolDone = this.Tank.GetCurrentCell() === this.CurrentPatrolDestination;

	constructor(public CurrentPatrolDestination: Cell, public Tank: Tank, public Area: KingdomArea) {
		if (isNullOrUndefined(this.CurrentPatrolDestination)) {
			throw 'invalid destination';
		}
		if (isNullOrUndefined(this.Tank)) {
			throw 'not possible';
		}

		this._changePositionTimer = new Timer(20);
		this._cancelOrderTimer = new Timer(20);
	}

	public Update(): void {
		if (isNullOrUndefined(this.Tank)) {
			throw 'not possible';
		}

		if (this.IsPratrolDone) {
			if (this._changePositionTimer.IsElapsed()) {
				this.SetNextDestination();
			}
		} else if (this.IsIdle) {
			this.SetNextDestination();
			this.Tank.SetOrder(new SimpleOrder(this.CurrentPatrolDestination, this.Tank));
		} else {
			if (this._cancelOrderTimer.IsElapsed()) {
				this.Tank.CancelOrder();
			}
		}
	}

	private SetNextDestination(): void {
		if (this.Tank.HasDamage()) {
			const healSpot = this.Area.GetHealSpot();
			if (healSpot) {
				this.CurrentPatrolDestination = healSpot;
				return;
			}
		}

		const spot = this.Area.GetRandomFreeCell();
		if (spot) {
			this.CurrentPatrolDestination = spot;
		}
	}

	public Cancel(): void {
		if (isNullOrUndefined(this.Tank)) {
			throw 'not possible';
		}

		this.Tank.CancelOrder();
	}
}
