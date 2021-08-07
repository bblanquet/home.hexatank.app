import { ZKind } from './../ZKind';
import { Item } from '../Item';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { TickTimer } from '../../../Utils/Timer/TickTimer';
import { SvgArchive } from '../../Framework/SvgArchiver';

export class Crater extends Item {
	BoundingBox: BoundingBox;
	private _timer: TickTimer;
	private _isDone: boolean = false;

	constructor(boundingbox: BoundingBox) {
		super();
		this.Z = ZKind.Field;
		this.BoundingBox = boundingbox;
		this._timer = new TickTimer(120);

		this.GenerateSprite(SvgArchive.destruction.floorExplosion, (s) => (s.alpha = 0.6));
		this.GenerateSprite(SvgArchive.destruction.debris);
		this.InitPosition(boundingbox.GetPosition());
	}

	public Destroy(): void {
		super.Destroy();
		this.IsUpdatable = false;
	}

	public GetBoundingBox(): BoundingBox {
		return this.BoundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(): void {
		super.Update();

		if (this._isDone) {
			this.Destroy();
		}

		if (this._timer.IsElapsed()) {
			this.GetCurrentSprites().Get(SvgArchive.destruction.floorExplosion).alpha -= 0.05;
			if (this.GetCurrentSprites().Get(SvgArchive.destruction.floorExplosion).alpha <= 0) {
				this._isDone = true;
			}
		}
	}
}
