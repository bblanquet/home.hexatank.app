import { Identity, Relationship } from './../../../Identity';
import { FadeOutAnimation } from '../../../Animator/FadeOutAnimation';
import { FadeInAnimation } from '../../../Animator/FadeInAnimation';
import { RotationAnimator } from '../../../Animator/RotationAnimator';
import { IAnimator } from '../../../Animator/IAnimator';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { CellState } from '../../CellState';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { ReactorField } from './ReactorField';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { ZKind } from '../../../ZKind';

export class ReactorAppearance extends Item {
	private _isIncreasingOpacity: boolean = false;
	private _onCellStateChanged: (obj: any, cellState: CellState) => void;
	private _animator: IAnimator;
	private _rotator: IAnimator;
	private _coverRotator: IAnimator;
	private _lightAnimator: IAnimator;

	constructor(public Reactor: ReactorField, private _light: string) {
		super();
		this.Z = ZKind.Field;

		this.Reactor.OnPowerChanged.On((e: any, isFadeIn: boolean) => {
			if (isFadeIn) {
				this._lightAnimator = new FadeInAnimation(
					this,
					[ this.Reactor.Hq.Identity.Skin.GetReactor(), SvgArchive.bonus.reactor.light ],
					0,
					1,
					0.05
				);
			} else {
				this._lightAnimator = new FadeOutAnimation(
					this,
					[ this.Reactor.Hq.Identity.Skin.GetReactor(), SvgArchive.bonus.reactor.light ],
					1,
					0,
					0.05
				);
			}
		});
		this.GenerateSprite(SvgArchive.bonus.coverBottom);
		this.GenerateSprite(SvgArchive.bonus.reactor.gray);
		this.GenerateSprite(this.Reactor.Hq.Identity.Skin.GetReactor(), (p) => (p.alpha = 0));
		this.GenerateSprite(SvgArchive.bonus.reactor.light, (p) => (p.alpha = 0));
		this.GenerateSprite(SvgArchive.bonus.reactor.rotationCover);
		this.GenerateSprite(SvgArchive.bonus.reactor.cover);
		this.GenerateSprite(this._light);
		this.GenerateSprite(SvgArchive.bonus.coverTop);
		this.InitPosition(this.Reactor.GetCell().GetBoundingBox());

		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this.Reactor.GetCell().OnCellStateChanged.On(this._onCellStateChanged);
		this._animator = new BouncingScaleAnimator(this);
		this._rotator = new RotationAnimator(this, [ SvgArchive.bonus.reactor.light ], true);
		this._coverRotator = new RotationAnimator(this, [ SvgArchive.bonus.reactor.rotationCover ], true, 0.016);

		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.Reactor.GetCell().IsVisible();
		});

		this.SetProperty(SvgArchive.bonus.reactor.light, (p) => (p.alpha = 0));
	}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public Destroy(): void {
		super.Destroy();
		this.Reactor.GetCell().OnCellStateChanged.Off(this._onCellStateChanged);
	}

	public GetBoundingBox(): BoundingBox {
		return this.Reactor.GetCell().GetBoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsUpdatable) {
			return;
		}

		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
			if (this._animator.IsDone) {
				this.ChangeReferential(viewX, viewY);
			}
		} else {
			super.Update(viewX, viewY);
		}

		if (this.Reactor.IsLocked()) {
			this._coverRotator.Update(viewX, viewY);
		}

		if (!isNullOrUndefined(this._lightAnimator)) {
			this._lightAnimator.Update(viewX, viewY);
		}
		this._rotator.Update(viewX, viewY);

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

	public GetRelation(item: Identity): Relationship {
		return this.Reactor.GetIdentity().GetRelation(item);
	}

	private ChangeReferential(viewX: number, viewY: number) {
		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.Reactor.GetCell().GetBoundingBox().Width),
				(sprite.height = this.Reactor.GetCell().GetBoundingBox().Height);
			sprite.anchor.set(0.5);
		});
		this.IsCentralRef = true;
		super.Update(viewX, viewY);
	}
}
