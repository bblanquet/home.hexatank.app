import { BasicItem } from './../../../BasicItem';
import { RotationAnimator } from './../../../Animator/RotationAnimator';
import { BasicAnimatedItem } from './../../../BasicAnimatedItem';
import { IAnimator } from './../../../Animator/IAnimator';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { CellState } from '../../CellState';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { Reactor } from './Reactor';
import { GameSettings } from '../../../../Framework/GameSettings';

export class ReactorField extends Item {
	private _isIncreasingOpacity: boolean = false;
	private _onCellStateChanged: (obj: any, cellState: CellState) => void;
	private _animator: IAnimator;
	private _wires: BasicAnimatedItem[];
	private _reactor: BasicItem;

	constructor(public Reactor: Reactor, private _light: string) {
		super();
		this.Z = 1;

		this.GenerateSprite(Archive.bonus.coverBottom);
		this.GenerateSprite(this._light);
		this.GenerateSprite(Archive.bonus.coverTop);
		this.InitPosition(this.Reactor.GetCell().GetBoundingBox());

		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this.Reactor.GetCell().CellStateChanged.On(this._onCellStateChanged);
		this._animator = new BouncingScaleAnimator(this);

		this._wires = [
			this.GetWire(-GameSettings.Size / 4, -GameSettings.Size / 4, false),
			this.GetWire(GameSettings.Size / 4, GameSettings.Size / 4, true),
			this.GetWire(-GameSettings.Size / 4, GameSettings.Size / 4, false),
			this.GetWire(GameSettings.Size / 4, -GameSettings.Size / 4, true)
		];

		this._reactor = new BasicItem(
			BoundingBox.CreateFromBox(this.Reactor.GetCell().GetBoundingBox()),
			Archive.bonus.reactor.bottom,
			1
		);
		this._reactor.SetVisible(() => this.Reactor.GetCell().IsVisible());
		this._reactor.SetAlive(() => this.Reactor.IsUpdatable);

		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.Reactor.GetCell().IsVisible();
		});
	}

	private GetWire(x: number, y: number, side: boolean): BasicAnimatedItem {
		const wire = new BasicAnimatedItem(
			BoundingBox.CreateFromBoxAndShift(this.Reactor.GetCell().GetBoundingBox(), x, y),
			Archive.bonus.reactor.wire,
			1,
			(e) => new RotationAnimator(e, [ Archive.bonus.reactor.wire ], side)
		);
		wire.SetVisible(() => this.Reactor.GetCell().IsVisible());
		wire.SetAlive(() => this.Reactor.IsUpdatable);
		return wire;
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
		this._wires.forEach((w) => {
			w.Update(viewX, viewY);
		});

		this._reactor.Update(viewX, viewY);

		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
			if (this._animator.IsDone) {
				this.ChangeReferential(viewX, viewY);
			}
		} else {
			super.Update(viewX, viewY);
		}

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
			(sprite.width = this.Reactor.GetCell().GetBoundingBox().Width),
				(sprite.height = this.Reactor.GetCell().GetBoundingBox().Height);
			sprite.anchor.set(0.5);
		});
		this.IsCentralRef = true;
		super.Update(viewX, viewY);
	}
}
