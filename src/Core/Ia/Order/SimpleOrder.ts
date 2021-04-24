import { AStarEngine } from './../AStarEngine';
import { OrderState } from './OrderState';
import { Order } from './Order';
import { Cell } from '../../Items/Cell/Cell';
import { CellFinder } from '../../Items/Cell/CellFinder';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { ShieldField } from '../../Items/Cell/Field/Bonus/ShieldField';
import { AStarHelper } from '../AStarHelper';
import { OrderKind } from './OrderKind';
import { isNullOrUndefined } from '../../Utils/ToolBox';

export class SimpleOrder extends Order {
	protected CellFinder: CellFinder;
	protected GoalCells: Array<Cell>;
	protected CurrentGoal: Cell;
	protected FinalGoal: Cell;

	constructor(protected FinalOriginalGoal: Cell, protected Vehicle: Vehicle) {
		super();
		if (isNullOrUndefined(this.FinalOriginalGoal)) {
			throw 'invalid destination';
		}
		this.FinalGoal = FinalOriginalGoal;
		this.GoalCells = new Array<Cell>();
		this.CellFinder = new CellFinder();
	}

	GetGoals(): Cell[] {
		return [ this.FinalOriginalGoal ];
	}

	public GetKind(): OrderKind {
		return OrderKind.Simple;
	}
	public GetCells(): Cell[] {
		return this.GoalCells;
	}

	public Cancel(): void {
		super.Cancel();
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
				this.GoNextcell();
			}
		}
	}

	public IsDone(): boolean {
		if (this.Vehicle.GetCurrentCell() === this.FinalGoal) {
			this.SetState(OrderState.Passed);
		}
		return super.IsDone();
	}

	protected GoNextcell() {
		this.CurrentGoal = this.GetNextGoal();
		if (isNullOrUndefined(this.CurrentGoal)) {
			this.SetState(OrderState.Failed);
		} else {
			this.Vehicle.SetNextCell(this.CurrentGoal);
		}
	}

	protected Init(): boolean {
		if (this.GetState() === OrderState.None) {
			if (this.CreateGoalCells()) {
				this.GoNextcell();
				this.SetState(OrderState.Pending);
			} else {
				this.SetState(OrderState.Failed);
				return false;
			}
		}
		return true;
	}

	private GetNextGoal(): Cell {
		if (isNullOrUndefined(this.GoalCells) || this.GoalCells.length === 0) {
			return null;
		}

		const candidate = this.GoalCells.splice(0, 1)[0];
		if (!this.IsAccessible(candidate)) {
			if (this.CreateGoalCells()) {
				return this.GetNextGoal();
			} else {
				return null;
			}
		}

		return candidate;
	}

	public Reset(): void {
		super.Reset();
		this.FinalGoal = this.FinalOriginalGoal;
		this.SetState(OrderState.None);
	}

	private IsAccessible(c: Cell): boolean {
		const field = c.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(this.Vehicle) && !c.HasOccupier();
		}
		return !c.IsBlocked();
	}

	protected CreateGoalCells(): boolean {
		if (!this.IsAccessible(this.FinalGoal)) {
			this.FinalGoal = this.GetClosestCell();
			if (isNullOrUndefined(this.FinalGoal)) {
				return false;
			}
		}
		const filter = (c: Cell) => !isNullOrUndefined(c) && this.IsAccessible(c);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		const nextcells = new AStarEngine<Cell>(filter, cost).GetPath(
			this.Vehicle.GetCurrentCell(),
			this.FinalGoal,
			true
		);

		if (isNullOrUndefined(nextcells)) {
			return false;
		} else {
			this.GoalCells = nextcells;
			this.OnPathCreated.Invoke(this, this.GoalCells);
			return true;
		}
	}

	protected GetClosestCell(): Cell {
		const vehiculeCell = this.Vehicle.GetCurrentCell();
		if (this.FinalGoal.GetAllNeighbourhood().some((c) => c === vehiculeCell)) {
			return this.Vehicle.GetCurrentCell();
		} else {
			const cells = this.FinalGoal.GetNearby();
			if (cells.length === 0) {
				return null;
			} else {
				return this.CellFinder.GetClosestCell(cells, this.Vehicle);
			}
		}
	}
}
