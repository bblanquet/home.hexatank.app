import { OrderState } from './OrderState';
import { Order } from './Order';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { OrderKind } from './OrderKind';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';

export class BasicOrder extends Order {
	protected CurrentStep: Cell;
	protected Destination: Cell;

	constructor(protected Vehicle: Vehicle, protected Road: Cell[]) {
		super();
		ErrorHandler.ThrowNullOrEmpty(this.Road);
		this.Road.forEach((r) => {
			ErrorHandler.ThrowNullOrUndefined(r);
		});
		this.Destination = Road[Road.length - 1];
	}

	public GetKind(): OrderKind {
		return OrderKind.Simple;
	}
	public GetPath(): Cell[] {
		if (this.Road) {
			return this.Road;
		}
		return [];
	}

	public Cancel(): void {
		super.Cancel();
	}

	public Update(): void {
		if (!this.CurrentStep) {
			this.SetNextStep();
		}

		if (this.CurrentStep === this.Vehicle.GetCurrentCell()) {
			this.OnNextStep.Invoke(this, this.CurrentStep);
			if (this.CurrentStep === this.Destination) {
				this.SetState(OrderState.Passed);
			} else {
				this.SetNextStep();
			}
		}
	}

	public IsDone(): boolean {
		if (this.Vehicle.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
		}
		return super.IsDone();
	}

	protected SetNextStep() {
		this.CurrentStep = this.GetNextStep();
		if (isNullOrUndefined(this.CurrentStep)) {
			this.SetState(OrderState.Failed);
		} else {
			this.Vehicle.SetNextCell(this.CurrentStep);
		}
	}

	private GetNextStep(): Cell {
		return this.Road.splice(0, 1)[0];
	}

	public Reset(): void {
		super.Reset();
		this.SetState(OrderState.None);
	}
}
