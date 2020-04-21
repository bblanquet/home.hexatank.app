import { HealField } from './../../../Items/Cell/Field/HealField';
import { TimeTimer } from './../../../Utils/Timer/TimeTimer';
import { isNullOrUndefined } from 'util';
import { ITimer } from '../../../Utils/Timer/ITimer';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { KingdomArea } from '../Utils/KingdomArea';
import { TickTimer } from '../../../Utils/Timer/TickTimer';
import { SimpleOrder } from '../../Order/SimpleOrder';
import { AliveItem } from '../../../Items/AliveItem';

export class TroopDecisionMaker {
	private _changePositionTimer: ITimer;
	private _cancelOrderTimer: ITimer;
	private _idleTimer: ITimer;

	private readonly IsPratrolDone = this.Tank.GetCurrentCell() === this.CurrentPatrolDestination;
	private _target: AliveItem;

	constructor(public CurrentPatrolDestination: Cell, public Tank: Tank, public Area: KingdomArea) {
		if (isNullOrUndefined(this.CurrentPatrolDestination)) {
			throw 'invalid destination';
		}
		if (isNullOrUndefined(this.Tank)) {
			throw 'not possible';
		}

		this._changePositionTimer = new TickTimer(20);
		this._cancelOrderTimer = new TickTimer(20);
		this._idleTimer = new TimeTimer(0);
	}

	SetTarget(cell: Cell) {
		this._target = cell.GetShootableEntity();
		this.Tank.SetMainTarget(this._target);
	}

	public Update(): void {
		if (isNullOrUndefined(this.Tank)) {
			throw 'not possible';
		}

		if (this.IsPratrolDone) {
			if (this._changePositionTimer.IsElapsed()) {
				this.SetNextDestination();
			}
		} else if (this.IsIdle()) {
			if (isNullOrUndefined(this._idleTimer)) {
				this._idleTimer = new TimeTimer(4000);
			}

			if (this._idleTimer.IsElapsed()) {
				this._idleTimer = null;
				this.SetNextDestination();
				this.Tank.SetOrder(new SimpleOrder(this.CurrentPatrolDestination, this.Tank));
			}
		} else {
			if (this._cancelOrderTimer.IsElapsed()) {
				this.Tank.CancelOrder();
			}
		}
	}

	private IsIdle(): boolean {
		return !(this.Tank.IsExecutingOrder() || this.Tank.HasPendingOrder() || this.IsCloseFromFoe());
	}

	private SetNextDestination(): void {
		if (this._target && this._target.IsAlive()) {
			if (this.IsCloseFromFoe()) {
				return;
			} else {
				const availableCells = this._target
					.GetCurrentCell()
					.GetNeighbourhood()
					.filter((c) => !(<Cell>c).IsBlocked())
					.map((c) => <Cell>c);
				if (0 < availableCells.length) {
					this.CurrentPatrolDestination = availableCells[0];
					return;
				}
			}
		}

		if (this.Tank.HasDamage()) {
			if (this.Tank.GetCurrentCell().GetField() instanceof HealField) {
				return;
			}
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

	private IsCloseFromFoe() {
		if (this._target && this._target.IsAlive()) {
			return this._target.GetCurrentCell().GetAllNeighbourhood().some((c) => c === this.Tank.GetCurrentCell());
		} else {
			return false;
		}
	}

	public Cancel(): void {
		if (isNullOrUndefined(this.Tank)) {
			throw 'not possible';
		}

		this.Tank.CancelOrder();
	}
}
