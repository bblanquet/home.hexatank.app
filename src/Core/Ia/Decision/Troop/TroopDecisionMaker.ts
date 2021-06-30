import { TargetMonitoredOrder } from './../../Order/TargetMonitoredOrder';
import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';
import { TimeTimer } from './../../../../Utils/Timer/TimeTimer';
import { ITimer } from '../../../../Utils/Timer/ITimer';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { IaArea } from '../Utils/IaArea';
import { AliveItem } from '../../../Items/AliveItem';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { MonitoredOrder } from '../../Order/MonitoredOrder';
import { TypeTranslator } from '../../../Items/Cell/Field/TypeTranslator';
import { ErrorHandler } from '../../../../Utils/Exceptions/ErrorHandler';

export class TroopDecisionMaker {
	private _changePositionTimer: ITimer;
	private _cancelOrderTimer: ITimer;
	private _idleTimer: ITimer;

	private readonly IsPratrolDone = this.Tank.GetCurrentCell() === this.CurrentPatrolDestination;
	private _target: AliveItem;

	constructor(public CurrentPatrolDestination: Cell, public Tank: Tank, public Area: IaArea) {
		ErrorHandler.ThrowNull(this.CurrentPatrolDestination);
		ErrorHandler.ThrowNull(this.Tank);

		this._changePositionTimer = new TimeTimer(3000);
		this._cancelOrderTimer = new TimeTimer(3000);
		this._idleTimer = new TimeTimer(0);
	}

	public SetTarget(cell: Cell): void {
		if (cell.IsShootable()) {
			this._target = cell.GetShootableEntity();
			this.Tank.SetMainTarget(this._target);
		} else {
			this.Tank.GiveOrder(new MonitoredOrder(cell, this.Tank));
		}
	}

	public Update(): void {
		ErrorHandler.ThrowNull(this.Tank);

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
				this.Tank.GiveOrder(new TargetMonitoredOrder(this.CurrentPatrolDestination, this.Tank));
			}
		} else {
			if (this._cancelOrderTimer.IsElapsed()) {
				this.Tank.CancelOrder();
			}
		}
	}

	public IsIdle(): boolean {
		return !(this.Tank.HasCurrentOrder() || this.Tank.HasNextOrder() || this.IsCloseFromTarget());
	}

	private SetNextDestination(): void {
		if (this._target && this._target.IsAlive()) {
			if (this.IsCloseFromTarget()) {
				return;
			} else {
				const availableCells = this._target.GetCurrentCell().GetUnblockedRange().filter((c) => !c.IsBlocked());
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
		return this.Tank.GetCurrentCell().GetNearby().some((c) => TypeTranslator.HasFoeVehicle(c, this.Tank.Identity));
	}

	private IsCloseFromTarget() {
		if (this._target && this._target.IsAlive()) {
			return this._target.GetCurrentCell().GetNearby().some((c) => c === this.Tank.GetCurrentCell());
		} else {
			return false;
		}
	}

	public Cancel(): void {
		ErrorHandler.ThrowNull(this.Tank);
		this.Tank.CancelOrder();
	}
}
