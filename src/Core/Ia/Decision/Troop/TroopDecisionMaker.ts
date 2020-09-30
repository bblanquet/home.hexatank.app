import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';
import { TimeTimer } from './../../../Utils/Timer/TimeTimer';
import { ITimer } from '../../../Utils/Timer/ITimer';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { KingdomArea } from '../Utils/KingdomArea';
import { TickTimer } from '../../../Utils/Timer/TickTimer';
import { SimpleOrder } from '../../Order/SimpleOrder';
import { AliveItem } from '../../../Items/AliveItem';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

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

	public SetTarget(cell: Cell): void {
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

			if (this.Tank.HasTarget() || this._idleTimer.IsElapsed()) {
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

	public IsIdle(): boolean {
		return !(this.Tank.IsExecutingOrder() || this.Tank.HasPendingOrder() || this.IsCloseFromTarget());
	}

	private SetNextDestination(): void {
		if (this._target && this._target.IsAlive()) {
			if (this.IsCloseFromTarget()) {
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
			if (this.Tank.GetCurrentCell().GetField() instanceof MedicField) {
				return;
			}
			const healSpot = this.Area.GetHealSpot();
			if (healSpot) {
				this.CurrentPatrolDestination = healSpot;
				return;
			}
		}

		const spot = this.Area.GetRandomFreeUnitCell();
		if (spot) {
			this.CurrentPatrolDestination = spot;
		}
	}

	public IsCloseFromEnemy(): boolean {
		return this.Tank
			.GetCurrentCell()
			.GetAllNeighbourhood()
			.some((c) => (c as Cell).HasEnemy(this.Tank) && (c as Cell).HasOccupier());
	}

	private IsCloseFromTarget() {
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
