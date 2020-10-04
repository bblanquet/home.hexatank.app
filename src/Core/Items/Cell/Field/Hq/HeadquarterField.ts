import { ZKind } from './../../../ZKind';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { Cell } from '../../Cell';
import { TickTimer } from '../../../../Utils/Timer/TickTimer';
import { Headquarter } from './Headquarter';
import { Field } from '../Field';
import { Vehicle } from '../../../Unit/Vehicle';
import { Truck } from '../../../Unit/Truck';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { GameSettings } from '../../../../Framework/GameSettings';

export class HeadQuarterField extends Field {
	private _timer: TickTimer;
	IsFading: boolean;
	Diamonds: number = 0;

	constructor(private _hq: Headquarter, ceil: Cell, sprite: string) {
		super(ceil);
		this.GetCell().SetField(this);
		this.Z = ZKind.Field;
		this._timer = new TickTimer(3);
		this.GenerateSprite(sprite);
		this.InitPosition(ceil.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	public Destroy(): void {
		super.Destroy();
		this.IsUpdatable = false;
		this.GetCell().DestroyField();
	}

	public Support(vehicule: Vehicle): void {
		vehicule.TranslatingDuration = GameSettings.TranslatinDuration;
		vehicule.RotatingDuration = GameSettings.RotatingDuration;
		vehicule.Attack = GameSettings.Attack;

		if (vehicule instanceof Truck) {
			var truck = vehicule as Truck;
			if (!truck.IsEnemy(this._hq)) {
				this.Diamonds = truck.Unload();
			}
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

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (this.IsUpdatable) {
			super.Update(viewX, viewY);

			if (this._timer.IsElapsed()) {
				if (this.GetSprites()[0].alpha < 0.25) {
					this.IsFading = false;
				}

				if (1 < this.GetSprites()[0].alpha) {
					this.IsFading = true;
				}

				if (this.IsFading) {
					this.GetSprites()[0].alpha -= 0.01;
				}

				if (!this.IsFading) {
					this.GetSprites()[0].alpha += 0.01;
				}
			}
		}
	}
}
