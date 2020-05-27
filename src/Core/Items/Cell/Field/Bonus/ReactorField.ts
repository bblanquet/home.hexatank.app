import { InfiniteFadeAnimation } from './../../../Animator/InfiniteFadeAnimation';
import { IAnimator } from './../../../Animator/IAnimator';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { CellState } from '../../CellState';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { Reactor } from './Reactor';

export class ReactorField extends Item {
	private _isIncreasingOpacity: boolean = false;
	private _onCellStateChanged: (obj: any, cellState: CellState) => void;
	private _animator: IAnimator;
	private _fadeAnimator: IAnimator;

	constructor(public InfluenceField: Reactor, private _light: string) {
		super();
		this.Z = 1;
		this.GenerateSprite(Archive.bonus.coverBottom);
		this.GenerateSprite(Archive.bonus.reactor.bottom);
		this.GenerateSprite(Archive.bonus.reactor.top);
		this.GenerateSprite(this._light);
		this.GenerateSprite(Archive.bonus.coverTop);
		this.InitPosition(this.InfluenceField.GetCell().GetBoundingBox());

		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this.InfluenceField.GetCell().CellStateChanged.On(this._onCellStateChanged);
		this._animator = new BouncingScaleAnimator(this);
		this._fadeAnimator = new InfiniteFadeAnimation(this, Archive.bonus.reactor.top, 0.2, 1, 0.005);
	}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public Destroy(): void {
		super.Destroy();
		this.InfluenceField.GetCell().CellStateChanged.Off(this._onCellStateChanged);
	}

	public GetBoundingBox(): BoundingBox {
		return this.InfluenceField.GetCell().GetBoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
			if (this._animator.IsDone) {
				this.ChangeReferential(viewX, viewY);
			}
		} else {
			super.Update(viewX, viewY);
		}

		this._fadeAnimator.Update(viewX, viewY);

		this.SetProperty(this._light, (s) => {
			if (s.alpha < 0.1) {
				this._isIncreasingOpacity = true;
			}

			if (1 <= s.alpha) {
				this._isIncreasingOpacity = false;
			}

			s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
		});
	}

	private ChangeReferential(viewX: number, viewY: number) {
		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.InfluenceField.GetCell().GetBoundingBox().Width),
				(sprite.height = this.InfluenceField.GetCell().GetBoundingBox().Height);
			sprite.anchor.set(0.5);
		});
		this.IsCentralRef = true;
		super.Update(viewX, viewY);
	}
}
