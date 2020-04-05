import { Cell } from '../../../Items/Cell/Cell';
import { KingdomArea } from '../../Utils/KingdomArea';
import { Timer } from '../../../Utils/Timer/Timer';
import { isNullOrUndefined } from 'util';
import { SimpleOrder } from '../../Order/SimpleOrder';
import { Tank } from '../../../Items/Unit/Tank';
import { ITimer } from '../../../Utils/Timer/ITimer';

export class TroopDecisionMaker {
	private _changePositionTimer: ITimer;
	private _cancelOrderTimer: ITimer;

	constructor(public CurrentPatrolDestination: Cell, public Tank: Tank, public HqArea: KingdomArea) {
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

		if (this.Tank.GetCurrentCell() === this.CurrentPatrolDestination) {
			if (this._changePositionTimer.IsElapsed()) {
				const nextPatrolcell = this.HqArea.GetRandomFreeCell();
				if (nextPatrolcell) {
					this.CurrentPatrolDestination = nextPatrolcell;
				}
			}
		} else if (!this.Tank.IsExecutingOrder() && !this.Tank.HasPendingOrder()) {
			this.Tank.SetOrder(new SimpleOrder(this.CurrentPatrolDestination, this.Tank));
		} else {
			if (this._cancelOrderTimer.IsElapsed()) {
				this.Tank.CancelOrder();
			}
		}
	}

	public Cancel(): void {
		if (isNullOrUndefined(this.Tank)) {
			throw 'not possible';
		}

		this.Tank.CancelOrder();
	}
}