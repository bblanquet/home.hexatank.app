import { BouncingScaleUpAnimator } from './../../../Animator/BouncingScaleUpAnimator';
import { BouncingScaleDownAnimator } from './../../../Animator/BouncingScaleDownAnimator';
import { IAnimator } from './../../../Animator/IAnimator';
import { IActiveContainer } from './../IActiveContainer';
import { Cell } from '../../Cell';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { AliveField } from '../AliveField';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { CellState } from '../../CellState';
import { ZKind } from '../../../ZKind';
import { IHeadquarter } from '../Hq/IHeadquarter';
import { Identity, Relationship } from '../../../Identity';

export abstract class AliveBonusField extends AliveField implements IActiveContainer {
	private _animator: IAnimator;
	private _isIncreasingOpacity: boolean = false;
	public Energy: number = 0;

	constructor(cell: Cell, private _bonus: string[], private _id: Identity, protected energyProvider: IHeadquarter) {
		super(cell, _id);
		this.Z = ZKind.Field;
		this.GenerateSprite(SvgArchive.bonus.coverBottom);
		this._bonus.forEach((b) => {
			this.GenerateSprite(b);
		});
		this.GenerateSprite(this._id.Skin.GetLight());
		this.InitPosition(cell.GetBoundingBox().GetPosition());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		this._animator = new BouncingScaleAnimator(this);
		this.Energy = this.energyProvider.GetCellEnergy(cell.GetHexCoo());
	}

	protected GetReactorsPower(hq: IHeadquarter): number {
		const connectedReactors = hq.GetReactors().filter((f) => f.GetInternal().Exist(this.GetCell().Coo()));
		const sum = connectedReactors.map((i) => i.GetPower()).reduce((a, b) => a + b, 0);
		return sum;
	}

	public ChangeEnergy(isUp: boolean): void {
		if (this.IsUpdatable) {
			const formerEnergy = this.Energy;

			this.Energy = isUp ? this.Energy + 1 : this.Energy - 1;

			if (this.Energy === 1 && formerEnergy === 0) {
				this._animator = new BouncingScaleUpAnimator(this, this._bonus);
			} else if (this.Energy === 0 && formerEnergy === 1) {
				this._animator = new BouncingScaleDownAnimator(this, this._bonus);
			}
		}
	}

	protected HandleCellStateChanged(cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}

	public Update(): void {
		super.Update();

		if (!this._animator.IsDone) {
			this._animator.Update();
		}

		this.AnimateLight();
	}

	private AnimateLight() {
		if (0 < this.Energy) {
			this.SetProperty(this._id.Skin.GetLight(), (s) => {
				if (s.alpha < 0.1) {
					this._isIncreasingOpacity = true;
				}
				if (1 <= s.alpha) {
					this._isIncreasingOpacity = false;
				}
				s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
			});
		} else {
			this.SetProperty(this._id.Skin.GetLight(), (e) => (e.alpha = 0));
		}
	}

	IsDesctrutible(): boolean {
		return true;
	}
	IsBlocking(): boolean {
		return 0 < this.Energy;
	}

	public abstract Support(vehicule: Vehicle): void;
	public abstract GetRelation(item: Identity): Relationship;
	public Select(context: IInteractionContext): boolean {
		return false;
	}
}
