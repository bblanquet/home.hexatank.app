import { Cell } from '../../../Items/Cell/Cell';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { OrderState } from '../OrderState';
import { SimpleOrder } from '../SimpleOrder';

export class SmartSimpleOrder extends SimpleOrder {
	constructor(FinalOriginalGoal: Cell, vehicle: Vehicle) {
		super(FinalOriginalGoal, vehicle);
	}

	public Do(): void {
		if (!this.Init()) {
			return;
		}

		if (this.CurrentGoal === this.Vehicle.GetCurrentCell()) {
			this.OnNextCell.Invoke(this, this.CurrentGoal);
			if (this.CurrentGoal === this.FinalGoal) {
				this.SetState(this.FinalGoal === this.FinalOriginalGoal ? OrderState.Passed : OrderState.Failed);
			} else {
				if (this.CreateGoalCells()) {
					this.GoNextcell();
					if (this.GetState() !== OrderState.Failed) {
						this.SetState(OrderState.Pending);
					}
				} else {
					this.SetState(OrderState.Failed);
				}
			}
		}
	}
}
