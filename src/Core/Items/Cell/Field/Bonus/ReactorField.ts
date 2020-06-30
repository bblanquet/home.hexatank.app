import { RotationAnimator } from './../../../Animator/RotationAnimator';
import { IAnimator } from './../../../Animator/IAnimator';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { CellState } from '../../CellState';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { Reactor } from './Reactor';
import { AliveItem } from '../../../AliveItem';

export class ReactorField extends Item {
	private _isIncreasingOpacity: boolean = false;
	private _onCellStateChanged: (obj: any, cellState: CellState) => void;
	private _animator: IAnimator;
	private _rotator: IAnimator;

	constructor(public Reactor: Reactor, private _light: string) {
		super();
		this.Z = 1;

		this.GenerateSprite(Archive.bonus.coverBottom);
		this.GenerateSprite(Archive.bonus.reactor.light);
		this.GenerateSprite(Archive.bonus.reactor.dark);
		this.GenerateSprite(Archive.bonus.reactor.top);
		this.GenerateSprite(this._light);
		this.GenerateSprite(Archive.bonus.coverTop);
		this.InitPosition(this.Reactor.GetCell().GetBoundingBox());

		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this.Reactor.GetCell().CellStateChanged.On(this._onCellStateChanged);
		this._animator = new BouncingScaleAnimator(this);
		this._rotator = new RotationAnimator(this, [ Archive.bonus.reactor.dark ], true);

		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.Reactor.GetCell().IsVisible();
		});
	}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public Destroy(): void {
		super.Destroy();
		this.Reactor.GetCell().CellStateChanged.Off(this._onCellStateChanged);
	}

	public GetBoundingBox(): BoundingBox {
		return this.Reactor.GetCell().GetBoundingBox();
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

	public IsEnemy(item: AliveItem): boolean {
		return this.Reactor.Hq.IsEnemy(item);
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
