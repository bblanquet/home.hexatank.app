import { LiteEvent } from './../../../../../Utils/Events/LiteEvent';
import { IHeadquarter } from './../Hq/IHeadquarter';
import { Identity, Relationship } from './../../../Identity';
import { Field } from '../Field';
import { Vehicle } from '../../../Unit/Vehicle';
import { IAnimator } from '../../../Animator/IAnimator';
import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { CellState } from '../../CellState';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { IActiveContainer } from '../IActiveContainer';
import { ZKind } from '../../../ZKind';
import { Explosion } from '../../../Unit/Explosion';
import { ErrorCat, ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';
import { ReactorField } from './ReactorField';

export abstract class BonusField extends Field implements IActiveContainer {
	private _animator: IAnimator;
	private _isIncreasingOpacity: boolean = false;
	public Energy: number = 0;
	public Identity: Identity;
	public OnEnergyChanged: LiteEvent<number> = new LiteEvent<number>();
	private _handleReactorLost: any = this.Handle.bind(this);

	constructor(cell: Cell, private _bonus: string[], protected hq: IHeadquarter, override: boolean = true) {
		super(cell, hq.Identity);
		this.Identity = hq.Identity;
		this.Z = ZKind.Field;
		this.GenerateSprite(SvgArchive.bonus.coverBottom);
		this._bonus.forEach((b) => {
			this.GenerateSprite(b);
		});
		this.GenerateSprite(this.hq.Identity.Skin.GetLight());
		this.Energy = this.hq.GetCellEnergy(cell.GetHexCoo());
		this.hq.AddField(this, cell);
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		if (override) {
			this.InitPosition(cell.GetBoundingBox().GetPosition());
		}
		this._animator = new BouncingScaleAnimator(this);
		this.hq.OnReactorLost.On(this._handleReactorLost);
		this.Include(hq, cell);
	}

	private Include(hq: IHeadquarter, cell: Cell) {
		if (!hq.IsCovered(cell)) {
			this.Destroy();
			if (cell.IsVisible()) {
				new Explosion(cell.GetBoundingBox(), SvgArchive.constructionEffects, ZKind.Sky, false);
			}
		}
	}

	private Handle(src: any, value: ReactorField): void {
		this.Include(this.hq, this.GetCell());
	}

	public GetHq(): IHeadquarter {
		return this.hq;
	}

	public ChangeEnergy(isUp: boolean): void {
		this.Energy = isUp ? this.Energy + 1 : this.Energy - 1;
		this.OnEnergyChanged.Invoke(this, this.Energy);
	}

	public IsAlly(id: Identity): boolean {
		return this.hq.GetRelation(id) === Relationship.Ally;
	}

	protected OnCellStateChanged(cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(): void {
		if (!this.IsUpdatable) {
			//got destroyed by a lost reactor
			return;
		}

		if (this.GetCell().GetField() !== this) {
			ErrorHandler.Throw(ErrorCat.invalidComputation, `field cell less`);
		}

		if (!this._animator.IsDone) {
			this._animator.Update();
		} else {
			super.Update();
		}
		if (0 < this.Energy) {
			this.SetProperty(this.hq.Identity.Skin.GetLight(), (s) => {
				if (s.alpha < 0.1) {
					this._isIncreasingOpacity = true;
				}

				if (1 <= s.alpha) {
					this._isIncreasingOpacity = false;
				}

				s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
			});
		} else {
			this.SetProperty(this.hq.Identity.Skin.GetLight(), (e) => (e.alpha = 0));
		}
	}

	abstract Support(vehicule: Vehicle): void;

	IsDesctrutible(): boolean {
		return false;
	}
	IsBlocking(): boolean {
		return false;
	}
}
