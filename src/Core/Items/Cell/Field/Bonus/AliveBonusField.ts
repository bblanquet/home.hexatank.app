import { BouncingScaleUpAnimator } from './../../../Animator/BouncingScaleUpAnimator';
import { BouncingScaleDownAnimator } from './../../../Animator/BouncingScaleDownAnimator';
import { IAnimator } from './../../../Animator/IAnimator';
import { IActiveContainer } from './../IActiveContainer';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { AliveField } from '../AliveField';
import { AliveItem } from '../../../AliveItem';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { CellState } from '../../CellState';
import { Headquarter } from '../Hq/Headquarter';

export abstract class AliveBonusField extends AliveField implements IActiveContainer {
	private _animator: IAnimator;
	private _isIncreasingOpacity: boolean = false;
	public Energy: number = 0;

	constructor(cell: Cell, private _bonus: string[], private _hq: Headquarter) {
		super(cell);
		this.GetCell().SetField(this);
		this.Z = 1;
		this.GenerateSprite(Archive.bonus.coverBottom);
		this._bonus.forEach((b) => {
			this.GenerateSprite(b);
		});
		this.GenerateSprite(this._hq.GetSkin().GetLight());
		// this.GenerateSprite(Archive.bonus.coverTop);
		this.InitPosition(cell.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		this._animator = new BouncingScaleAnimator(this);
		this.Energy = this._hq.GetCellEnergy(cell.GetCoordinate());
	}

	protected GetReactorsPower(hq: Headquarter): number {
		const connectedReactors = hq.GetReactors().filter((f) => f.GetInternal().Exist(this.GetCell().GetCoordinate()));
		const sum = connectedReactors.map((i) => i.GetPower()).reduce((a, b) => a + b, 0);
		return sum;
	}

	public EnergyChanged(isUp: boolean): void {
		const formerEnergy = this.Energy;

		this.Energy = isUp ? this.Energy + 1 : this.Energy - 1;

		if (this.Energy === 1 && formerEnergy === 0) {
			this._animator = new BouncingScaleUpAnimator(this, this._bonus);
		} else if (this.Energy === 0 && formerEnergy === 1) {
			this._animator = new BouncingScaleDownAnimator(this, this._bonus);
		}
	}

	protected OnCellStateChanged(cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
		}

		this.AnimateLight();
	}

	private AnimateLight() {
		if (0 < this.Energy) {
			this.SetProperty(this._hq.GetSkin().GetLight(), (s) => {
				if (s.alpha < 0.1) {
					this._isIncreasingOpacity = true;
				}
				if (1 <= s.alpha) {
					this._isIncreasingOpacity = false;
				}
				s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
			});
		} else {
			this.SetProperty(this._hq.GetSkin().GetLight(), (e) => (e.alpha = 0));
		}
	}

	IsDesctrutible(): boolean {
		return true;
	}
	IsBlocking(): boolean {
		return 0 < this.Energy;
	}

	public abstract Support(vehicule: Vehicle): void;
	public abstract IsEnemy(item: AliveItem): boolean;
	public Select(context: IInteractionContext): boolean {
		return false;
	}
}
