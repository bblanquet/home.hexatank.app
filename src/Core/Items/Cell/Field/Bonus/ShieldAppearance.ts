import { CellState } from './../../CellState';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { InfiniteFadeAnimation } from '../../../Animator/InfiniteFadeAnimation';
import { IAnimator } from '../../../Animator/IAnimator';
import { ZKind } from '../../../ZKind';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { AliveBonusField } from './AliveBonusField';

export class ShieldAppearance extends Item {
	private _fadeAnimator: IAnimator;
	public Animator: IAnimator;

	constructor(private _aliveItem: AliveBonusField) {
		super();
		[ SvgArchive.bonus.shieldLight, SvgArchive.bonus.shield ].forEach((b) => {
			this.GenerateSprite(b);
		});
		this.Z = ZKind.Sky;

		this.InitPosition(this._aliveItem.GetBoundingBox().GetPosition());
		this.Animator = new BouncingScaleAnimator(this);
		this._fadeAnimator = new InfiniteFadeAnimation(this, SvgArchive.bonus.shieldLight, 0.2, 1, 0.05);
		this._aliveItem.GetCell().OnCellStateChanged.On(this.HandleCellStateChanged.bind(this));
		this.HandleCellStateChanged(this, this._aliveItem.GetCell().GetState());

		if (this._aliveItem.Energy === 0) {
			this.SetProperty(SvgArchive.bonus.shield, (e) => {
				e.alpha = 0;
			});
			this.SetProperty(SvgArchive.bonus.shieldLight, (e) => {
				e.alpha = 0;
			});
		}
	}

	protected HandleCellStateChanged(obj: any, cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState === CellState.Visible;
		});
	}

	public Update(): void {
		if (this._aliveItem.IsAlive()) {
			if (0 < this._aliveItem.Energy) {
				this._fadeAnimator.Update();
			}
			super.Update();
			if (!this.Animator.IsDone) {
				this.Animator.Update();
			}
		} else {
			this.Destroy();
		}
	}

	public GetBoundingBox(): BoundingBox {
		return this._aliveItem.GetBoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}
}
