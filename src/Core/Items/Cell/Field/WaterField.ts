import { Cell } from '../Cell';
import { Field } from './Field';
import { CellState } from '../CellState';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { Vehicle } from '../../Unit/Vehicle';
import { ZKind } from '../../ZKind';

export class WaterField extends Field {
	private _isIncreasingOpacity: boolean = false;

	constructor(cell: Cell) {
		super(cell, null);
		this.Z = ZKind.Field;
		this.GenerateSprite(SvgArchive.nature.water.middle.background);
		this.GenerateSprite(SvgArchive.nature.water.middle.wave);
		this.GenerateSprite(SvgArchive.nature.water.leaf);

		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.GetCell().GetBoundingBox().Width),
				(sprite.height = this.GetCell().GetBoundingBox().Height);
			sprite.anchor.set(0.5);
		});

		this.IsCentralRef = true;

		this.InitPosition(cell.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	protected OnCellStateChanged(ceilState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = ceilState !== CellState.Hidden;
		});
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		this.SetProperty(SvgArchive.nature.water.leaf, (s) => (s.rotation += 0.005));

		this.SetProperty(SvgArchive.nature.water.middle.wave, (s) => {
			if (s.alpha < 0.4) {
				this._isIncreasingOpacity = true;
			}

			if (1 <= s.alpha) {
				this._isIncreasingOpacity = false;
			}

			s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}
	Support(vehicule: Vehicle): void {
		throw `WaterField not supposed to be there`;
	}

	IsDesctrutible(): boolean {
		return false;
	}
	IsBlocking(): boolean {
		return true;
	}
}
