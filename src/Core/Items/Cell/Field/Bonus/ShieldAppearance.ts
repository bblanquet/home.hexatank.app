import { CellState } from './../../CellState';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { InfiniteFadeAnimation } from '../../../Animator/InfiniteFadeAnimation';
import { IAnimator } from '../../../Animator/IAnimator';
import { ShieldField } from './ShieldField';
import { ZKind } from '../../../ZKind';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';

export class ShieldAppearance extends Item {
	private _fadeAnimator: IAnimator;
	public Animator: IAnimator;

	constructor(private _shield: ShieldField) {
		super();
		[ Archive.bonus.shieldLight, Archive.bonus.shield ].forEach((b) => {
			this.GenerateSprite(b);
		});
		this.Z = ZKind.Sky;

		this.Animator = new BouncingScaleAnimator(this);
		this._fadeAnimator = new InfiniteFadeAnimation(this, Archive.bonus.shieldLight, 0.2, 1, 0.01);
		this.InitPosition(this._shield.GetCell().GetBoundingBox());
		this._shield.GetCell().OnCellStateChanged.On(this.HandleCellStateChanged.bind(this));
		this.HandleCellStateChanged(this, this._shield.GetCell().GetState());

		if (this._shield.Energy === 0) {
			this.SetProperty(Archive.bonus.shield, (e) => {
				e.alpha = 0;
			});
			this.SetProperty(Archive.bonus.shieldLight, (e) => {
				e.alpha = 0;
			});
		}
	}

	protected HandleCellStateChanged(obj: any, cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState === CellState.Visible;
		});
	}

	public Update(viewX: number, viewY: number): void {
		if (this._shield.IsAlive()) {
			if (0 < this._shield.Energy) {
				this._fadeAnimator.Update(viewX, viewY);
			}
			super.Update(viewX, viewY);
			if (!this.Animator.IsDone) {
				this.Animator.Update(viewX, viewY);
			}
		} else {
			this.Destroy();
		}
	}

	public GetBoundingBox(): BoundingBox {
		return this._shield.GetBoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}
}
