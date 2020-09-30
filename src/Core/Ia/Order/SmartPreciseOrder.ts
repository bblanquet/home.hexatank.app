import { AStarEngine } from './../AStarEngine';
import { OrderState } from './OrderState';
import { Order } from './Order';
import { Cell } from '../../Items/Cell/Cell';
import { CellFinder } from '../../Items/Cell/CellFinder';
import { BasicItem } from '../../Items/BasicItem';
import { TickTimer } from '../../Utils/Timer/TickTimer';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Archive } from '../../Framework/ResourceArchiver';
import { AStarHelper } from '../AStarHelper';
import { OrderKind } from './OrderKind';
import { isNullOrUndefined } from '../../Utils/ToolBox';

export class SmartPreciseOrder extends Order {
	protected Currentcell: Cell;
	protected cells: Array<Cell>;
	protected cellFinder: CellFinder;
	private _uiPath: Array<BasicItem>;
	protected Dest: Cell;
	private _tryCount: number;
	private _sleep: TickTimer;
	constructor(protected OriginalDest: Cell, private _v: Vehicle) {
		super();
		if (isNullOrUndefined(this.OriginalDest)) {
			throw 'invalid destination';
		}
		this._sleep = new TickTimer(100);
		this._tryCount = 0;
		this.Dest = OriginalDest;
		this.cells = new Array<Cell>();
		this.cellFinder = new CellFinder();
		this._uiPath = [];
	}

	public Cancel(): void {
		super.Cancel();
		this.ClearPath();
	}

	public Do(): void {
		if (!this.Init()) {
			return;
		}

		if (this.Currentcell === this._v.GetCurrentCell()) {
			if (this._uiPath.length > 0) {
				this._uiPath[0].Destroy();
				this._uiPath.splice(0, 1);
			}

			if (this.Currentcell === this.Dest) {
				if (this.Dest === this.OriginalDest) {
					this._tryCount = 0;
					this.State = OrderState.Passed;
				} else {
					if (this._sleep.IsElapsed()) {
						if (this._tryCount >= 5) {
							this.State = OrderState.Failed;
						} else {
							this._tryCount += 1;
							if (isNullOrUndefined(this.OriginalDest.GetOccupier())) {
								this.Dest = this.OriginalDest;
							}
						}
					}
				}
			} else {
				if (this.FindPath()) {
					this.GoNextcell();
				} else {
					this.State = OrderState.Failed;
				}
			}
		}
	}

	public GetKind(): OrderKind {
		return OrderKind.Smart;
	}
	public GetDestination(): Cell[] {
		return [ this.OriginalDest ];
	}

	private GoNextcell() {
		var cell = this.GetNextcell();
		if (isNullOrUndefined(cell)) {
			this.State = OrderState.Failed;
		} else {
			this._v.SetNextCell(cell);
		}
	}

	private Init(): boolean {
		if (this.State === OrderState.None) {
			if (this.FindPath()) {
				this.GoNextcell();
				this.State = OrderState.Pending;
			} else {
				this.State = OrderState.Failed;
				return false;
			}
		}
		return true;
	}

	private GetNextcell(): Cell {
		if (isNullOrUndefined(this.cells) || this.cells.length === 0) {
			return null;
		}

		this.Currentcell = this.cells[0];
		this.cells.splice(0, 1);

		if (this.Currentcell.IsBlocked()) {
			if (this.FindPath()) {
				this.Currentcell = this.GetNextcell();
			} else {
				return null;
			}
		}

		return this.Currentcell;
	}

	public Reset(): void {
		super.Reset();
		this.Dest = this.OriginalDest;
	}

	protected FindPath(): boolean {
		if (this.Dest.IsBlocked()) {
			return false;
		}
		this.ClearPath();
		const filter = (c: Cell) => !isNullOrUndefined(c) && !c.IsBlocked();
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		const nextcells = new AStarEngine<Cell>(filter, cost).GetPath(this._v.GetCurrentCell(), this.Dest, true);

		if (isNullOrUndefined(nextcells)) {
			return false;
		}

		this.cells = nextcells;
		this.CreateUiPath();
		return true;
	}

	private ClearPath(): void {
		this._uiPath.forEach((pathItem) => {
			pathItem.Destroy();
		});
		this._uiPath = [];
	}

	private CreateUiPath(): void {
		if (!isNullOrUndefined(this.cells) && 0 < this.cells.length) {
			this.cells.forEach((cell) => {
				var pathItem = new BasicItem(cell.GetBoundingBox(), Archive.direction.moving);
				pathItem.SetVisible(this._v.IsSelected.bind(this._v));
				pathItem.SetAlive(this._v.IsAlive.bind(this._v));

				this._uiPath.push(pathItem);
			});
		}
	}

	protected GetClosestcell(): Cell {
		let cells = this.Dest.GetNeighbourhood().map((c) => <Cell>c);
		if (0 === this.Dest.GetAllNeighbourhood().filter((c) => c === this._v.GetCurrentCell()).length) {
			if (cells.length === 0) {
				return null;
			} else {
				return this.cellFinder.GetClosestCell(cells, this._v);
			}
		} else {
			return this._v.GetCurrentCell();
		}
	}
}
