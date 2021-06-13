import { TypeTranslator } from './../../Items/Cell/Field/TypeTranslator';
import { OrderState } from './OrderState';
import { Order } from './Order';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { OrderKind } from './OrderKind';
import { isNullOrUndefined } from '../../Utils/ToolBox';

export class BasicOrder extends Order {
	protected CurrentStep: Cell;
	protected Destination: Cell;

	constructor(protected Vehicle: Vehicle, protected Road: Cell[]) {
		super();
		if (isNullOrUndefined(this.Road) || 0 === this.Road.length) {
			throw 'invalid road';
		}
		this.Destination = Road[Road.length - 1];
	}

	public GetKind(): OrderKind {
		return OrderKind.Simple;
	}
	public GetPath(): Cell[] {
		return this.Road;
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
		const candidate = this.Road.splice(0, 1)[0];
		if (TypeTranslator.IsAccessible(candidate, this.Vehicle.Identity)) {
			return candidate;
		} else {
			return null;
		}
	}

	public Reset(): void {
		super.Reset();
		this.SetState(OrderState.None);
	}
}
