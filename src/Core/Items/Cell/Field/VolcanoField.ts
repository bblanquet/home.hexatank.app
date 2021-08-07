import { Cell } from '../Cell';
import { Field } from './Field';
import { CellState } from '../CellState';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { Vehicle } from '../../Unit/Vehicle';
import { ZKind } from '../../ZKind';

export class VolcanoField extends Field {
	private _isIncreasingOpacity: boolean = false;

	constructor(cell: Cell) {
		super(cell, null);
		this.Z = ZKind.Field;
		this.GenerateSprite(SvgArchive.nature.volcano);
		this.GenerateSprite(SvgArchive.nature.volcanaoAnimation);

		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.GetCell().GetBoundingBox().GetWidth()),
				(sprite.height = this.GetCell().GetBoundingBox().GetHeight());
			sprite.anchor.set(0.5);
		});

		this.IsCentralRef = true;

		this.InitPosition(cell.GetBoundingBox().GetPosition());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	protected OnCellStateChanged(ceilState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = ceilState !== CellState.Hidden;
		});
	}

	public Update(): void {
		super.Update();

		this.SetProperty(SvgArchive.nature.volcanaoAnimation, (s) => {
			if (s.alpha < 0) {
				this._isIncreasingOpacity = true;
			}

			if (0.6 <= s.alpha) {
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
		throw `VolcanoField not supposed to be there`;
	}

	IsDesctrutible(): boolean {
		return false;
	}
	IsBlocking(): boolean {
		return true;
	}
}
