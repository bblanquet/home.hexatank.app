import { Field } from './Field';
import { Timer } from '../../../Utils/Timer/Timer';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { Cell } from '../Cell';
import { Archive } from '../../../Framework/ResourceArchiver';
import { PlaygroundHelper } from '../../../Framework/PlaygroundHelper';
import { Vehicle } from '../../Unit/Vehicle';
import { GameSettings } from '../../../Framework/GameSettings';
import { Truck } from '../../Unit/Truck';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';

export class DiamondField extends Field {
	private _timer: Timer;
	IsFading: boolean;
	public Loaded: LiteEvent<{}> = new LiteEvent<{}>();

	constructor(cell: Cell) {
		super(cell);
		this.GetCell().SetField(this);
		this.Z = 0;
		this._timer = new Timer(3);
		this.GenerateSprite(Archive.diamondCell);
		this.InitPosition(cell.GetBoundingBox());
		this.GetDisplayObjects().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	public Destroy(): void {
		super.Destroy();
		PlaygroundHelper.Render.Remove(this);
		this.IsUpdatable = false;
		this.GetCell().DestroyField();
	}

	public Support(vehicule: Vehicle): void {
		vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
		vehicule.RotationSpeed = GameSettings.RotationSpeed;
		vehicule.Attack = GameSettings.Attack;

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
