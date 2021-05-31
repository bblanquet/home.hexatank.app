import { OrderState } from './OrderState';
import { Order } from './Order';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { OrderKind } from './OrderKind';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { ShieldField } from '../../Items/Cell/Field/Bonus/ShieldField';

export class BasicOrder extends Order {
	protected CurrentStep: Cell;
	protected Destination: Cell;

	constructor(protected Vehicle: Vehicle, protected Road: Cell[]) {
		super();
		if (isNullOrUndefined(this.Road) || 0 === this.Road.length) {
			throw 'invalid road';
		}
		this.Destination = Road[Road.length - 1];
		this.SetState(OrderState.None);
	}

	GetArrivals(): Cell[] {
		return [ this.Destination ];
	}

	public GetKind(): OrderKind {
		return OrderKind.Simple;
	}
	public GetCells(): Cell[] {
		return this.Road;
	}

	public Cancel(): void {
		super.Cancel();
	}

	public Do(): void {
		if (this.GetState() === OrderState.None) {
			this.SetNextStep();
			this.SetState(OrderState.Pending);
		}
		if (this.CurrentStep === this.Vehicle.GetCurrentCell()) {
			this.OnNextCell.Invoke(this, this.CurrentStep);
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
		if (isNullOrUndefined(this.Road) || this.Road.length === 0) {
			return null;
		}

		const candidate = this.Road.splice(0, 1)[0];
		if (!this.IsAccessible(candidate)) {
			return null;
		}

		return candidate;
	}

	public Reset(): void {
		super.Reset();
		this.SetState(OrderState.None);
	}

	private IsAccessible(c: Cell): boolean {
		const field = c.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(this.Vehicle.Identity) && !c.HasOccupier();
		}
		return !c.IsBlocked();
	}
}
