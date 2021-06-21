import { ZKind } from './../../ZKind';
import { Field } from './Field';
import { TickTimer } from '../../../Utils/Timer/TickTimer';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { Cell } from '../Cell';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { Vehicle } from '../../Unit/Vehicle';
import { GameSettings } from '../../../Framework/GameSettings';
import { Truck } from '../../Unit/Truck';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';

export class DiamondField extends Field {
	private _timer: TickTimer;
	public IsFading: boolean;
	public Loaded: LiteEvent<{}> = new LiteEvent<{}>();

	constructor(cell: Cell) {
		super(cell, null);
		this.Z = ZKind.Field;
		this._timer = new TickTimer(3);
		this.GenerateSprite(SvgArchive.diamondCell);
		this.InitPosition(cell.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	public Destroy(): void {
		this.IsUpdatable = false;
		super.Destroy();
	}

	public Support(vehicule: Vehicle): void {
		if (vehicule instanceof Truck) {
			var truck = vehicule as Truck;
			if (truck.Load()) {
				this.Loaded.Invoke(this, {});
			}
		}
	}
	public IsDesctrutible(): boolean {
		return false;
	}

	public IsBlocking(): boolean {
		return false;
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsUpdatable) {
			return;
		}

		super.Update(viewX, viewY);

		if (this._timer.IsElapsed()) {
			if (this.GetSprites()[0].alpha < 0) {
				this.IsFading = false;
			}

			if (1 < this.GetSprites()[0].alpha) {
				this.IsFading = true;
			}

			if (this.IsFading) {
				this.GetSprites()[0].alpha -= 0.05;
			}

			if (!this.IsFading) {
				this.GetSprites()[0].alpha += 0.05;
			}
		}
	}
}
