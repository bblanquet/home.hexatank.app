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

		if (this.CurrentStep === this.Vehicle.GetCurrentCell()) {
			this.OnNextCell.Invoke(this, this.CurrentStep);
			if (this.CurrentStep === this.FinalGoal) {
				this.SetState(this.FinalGoal === this.FinalOriginalGoal ? OrderState.Passed : OrderState.Failed);
			} else {
				if (this.UpdateRoad()) {
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
