import { MultiSelectionContext } from '../Menu/Smart/MultiSelectionContext';
import { ISelectable } from '../ISelectable';
import { Item } from './Item';
import { Vehicle } from './Unit/Vehicle';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import { BoundingBox } from '../Utils/Geometry/BoundingBox';
import { IInteractionContext } from '../Interaction/IInteractionContext';
import { ICancellable } from './Unit/ICancellable';
import { ICamouflageAble } from './Unit/ICamouflageAble';
import { MultiSelectionHelper } from '../Interaction/Combination/Multi/MultiSelectionHelper';
import { Cell } from './Cell/Cell';
import { Tank } from './Unit/Tank';

export class UnitGroup extends Item implements ISelectable, ICancellable, ICamouflageAble {
	private _units: Array<Vehicle> = new Array<Vehicle>();
	private _multiHandler: MultiSelectionHelper;

	public IsListeningOrder: boolean = false;
	public OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();

	constructor(private selectionContext: MultiSelectionContext) {
		super(false);
		this._multiHandler = new MultiSelectionHelper();
	}

	SetUnits(units: Array<Vehicle>): void {
		this.HasCamouflage = false;
		this._units = units;
	}

	Clear(): void {
		this._units.forEach((u) => {
			u.SetSelected(false);
		});
		this._units = [];
	}

	GetUnits(): Array<Vehicle> {
		return this._units;
	}

	Any(): boolean {
		return 0 < this._units.length;
	}

	public SetOrder(cells: Cell[]): void {
		this._multiHandler.GiveOrders(this._units, cells);
		this.HasCamouflage = false;
	}

	SetSelected(visible: boolean): void {
		if (!visible) {
			this._layerService.StartNavigation();
			this.selectionContext.Close();
			this.Clear();
		} else {
			this._units.forEach((v) => {
				v.SetSelected(visible);
			});
		}
		this.OnSelectionChanged.Invoke(this, this);
	}
	IsSelected(): boolean {
		return this.Any();
	}

	public GetBoundingBox(): BoundingBox {
		throw new Error('Method not implemented.');
	}
	public Select(context: IInteractionContext): boolean {
		context.OnSelect(this);
		return true;
	}

	CancelOrder(): void {
		this._units.forEach((u) => {
			u.CancelOrder();
		});
	}

	SetCamouflage(): boolean {
		this.HasCamouflage = true;
		this._units.forEach((u) => {
			if (u instanceof Tank) {
				(u as Tank).SetCamouflage();
			}
		});

		return true;
	}
	RemoveCamouflage(): void {
		this.HasCamouflage = false;
		this._units.forEach((u) => {
			const cam = (u as unknown) as ICamouflageAble;
			if (cam) {
				cam.RemoveCamouflage();
			}
		});
	}
	HasCamouflage: boolean;
}
