import { TimeTimer } from './../../../../Utils/Timer/TimeTimer';
import { BasicRangeAnimator } from './../../../Animator/BasicRangeAnimator';
import { GameContext } from '../../../../Framework/GameContext';
import { ReactorField } from './ReactorField';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { CellStateSetter } from '../../CellStateSetter';
import { Battery } from '../Battery';
import { BasicItem } from '../../../BasicItem';
import { ISelectable } from '../../../../ISelectable';
import { Headquarter } from '../Hq/Headquarter';
import { Field } from '../Field';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Vehicle } from '../../../Unit/Vehicle';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { Cell } from '../../Cell';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { CellContext } from '../../CellContext';
import { PeerHandler } from '../../../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../../../Components/Network/PacketKind';

export class Reactor extends Field implements ISelectable {
	private _fireAnimation: BasicRangeAnimator;
	private _area: Array<BasicItem> = new Array<BasicItem>();
	public Battery: Battery;
	private _totalRange: number = 4;
	private _isLocked: boolean;
	private _range: number = 0;
	private _internalCells: CellContext<Cell> = new CellContext<Cell>();
	public Lost: LiteEvent<Reactor> = new LiteEvent<Reactor>();
	public basicField: ReactorField;
	SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	public PowerChanged: LiteEvent<boolean> = new LiteEvent<boolean>();

	constructor(cell: Cell, public Hq: Headquarter, private _context: GameContext, private _light: string) {
		super(cell);
		this.Z = 1;
		this.Hq.AddReactor(this);
		this.Battery = new Battery(this.Hq, this);
		this.GetCell().SetField(this);
		this.GenerateSprite(Archive.selectionCell);
		this.SetProperty(Archive.selectionCell, (e) => {
			e.alpha = 0;
			e.anchor.set(0.5);
		});

		this.IsCentralRef = true;

		this.InitPosition(cell.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		this.basicField = new ReactorField(this, this._light);
		this.RangeAnimation();
	}

	public StartOverclockAnimation(): void {
		this._fireAnimation = new BasicRangeAnimator(this.GetCell(), this._totalRange);
	}

	public IsLocked(): boolean {
		return this._isLocked;
	}

	public SetLocked(l: boolean): void {
		this._isLocked = l;
		if (this._isLocked) {
			setTimeout(() => (this._isLocked = false), 30000);
		}
	}

	private RangeAnimation(): void {
		if (this._range < this._totalRange) {
			this._range += 1;
			this.RefreshInternal();
			this.UpdateCellStates(this._range);
			setTimeout(() => this.RangeAnimation(), 1000);
		}
	}

	Support(vehicule: Vehicle): void {
		if (vehicule.Hq != this.Hq) {
			this.SetSelected(false);

			this.Lost.Invoke(this, this);
			this.Lost.Clear();

			this.Hq = vehicule.Hq;
			this.Hq.AddReactor(this);

			this.basicField.Destroy();
			this.basicField = new ReactorField(this, this._light);
		}
	}

	IsDesctrutible(): boolean {
		return false;
	}

	IsBlocking(): boolean {
		return false;
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}

	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		this.basicField.Update(viewX, viewY);

		if (this._area) {
			this._area.forEach((area) => {
				area.Update(viewX, viewY);
			});
		}

		if (this._fireAnimation && !this._fireAnimation.IsDone) {
			this._fireAnimation.Update(viewX, viewY);
		}
	}

	public PowerUp(): void {
		const formerEnergy = this.Battery.GetUsedPower();
		PeerHandler.SendMessage(PacketKind.Influence, {
			Hq: this.Hq.GetCurrentCell().GetCoordinate(),
			cell: this.GetCell().GetCoordinate(),
			Type: 'PowerUp'
		});
		this.Battery.High();

		if (formerEnergy === 0 && this.Battery.GetUsedPower() === 1) {
			this.PowerChanged.Invoke(this, true);
		}
	}

	public GetPower(): number {
		return this.Battery.GetUsedPower();
	}

	public PowerDown(): void {
		if (0 < this.Battery.GetUsedPower()) {
			PeerHandler.SendMessage(PacketKind.Influence, {
				Hq: this.Hq.GetCurrentCell().GetCoordinate(),
				cell: this.GetCell().GetCoordinate(),
				Type: 'PowerDown'
			});
			this.Battery.Low();
			if (this.Battery.GetUsedPower() === 0) {
				this.PowerChanged.Invoke(this, false);
			}
		}
	}

	private UpdateCellStates(range: number) {
		CellStateSetter.SetStates(this._context, this.GetCell().GetAll(range));
	}

	SetSelected(isSelected: boolean): void {
		this.SetProperty(Archive.selectionCell, (e) => (e.alpha = isSelected ? 1 : 0));
		if (this.IsSelected()) {
			this.CreateArea();
		} else {
			this.ClearArea();
		}
		this.SelectionChanged.Invoke(this, this);
	}
	private CreateArea() {
		this.GetCell().GetSpecificRange(this._range).forEach((cell) => {
			const b = BoundingBox.CreateFromBox((<Cell>cell).GetBoundingBox());
			const area = new BasicItem(b, this.Hq.GetSkin().GetArea(), 3);
			area.SetVisible(() => true);
			area.SetAlive(() => true);

			this._area.push(area);
		});
	}

	public GetInternal(): CellContext<Cell> {
		if (this._internalCells.IsEmpty()) {
			this.RefreshInternal();
		}
		return this._internalCells;
	}

	public IsCovered(c: Cell): boolean {
		return this.GetInternal().Exist(c.GetCoordinate());
	}

	private RefreshInternal() {
		this._internalCells.Clear();
		this.GetCell().GetAllNeighbourhood(this._totalRange).forEach((cell) => {
			this._internalCells.Add(cell as Cell);
		});
		this._internalCells.Add(this.GetCell());
	}

	public GetAllCells(): Cell[] {
		return this.GetCell().GetAllNeighbourhood(this._totalRange).map((c) => c as Cell);
	}

	public Destroy(): void {
		super.Destroy();
		if (this.basicField) {
			this.basicField.Destroy();
		}
		this._area.forEach((a) => a.Destroy());
		this._area = [];
	}

	private ClearArea() {
		this._area.forEach((a) => a.Destroy());
		this._area = [];
	}

	HasStock(): boolean {
		return this.Battery.HasStock();
	}

	IsSelected(): boolean {
		return this.GetCurrentSprites().Get(Archive.selectionCell).alpha === 1;
	}
}
