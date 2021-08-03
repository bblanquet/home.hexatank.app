import { ZKind } from './../ZKind';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { Cell } from './Cell';
import { Item } from '../Item';
import { InteractionContext } from '../../Interaction/InteractionContext';

export class FlagCell extends Item {
	private _cell: Cell;
	private _isIncreasingOpacity: boolean = false;

	constructor(cell: Cell) {
		super();
		this.Z = ZKind.Cell;
		this.GenerateSprite(SvgArchive.flagCell, (e) => {
			e.anchor.set(0.5);
			e.alpha = 0;
		});
		this._cell = cell;
		this.InitPosition(cell.GetBoundingBox().GetPosition());
		this.IsCentralRef = true;
	}

	public GetCell(): Cell {
		return this._cell;
	}

	public SetCell(cell: Cell): void {
		this._cell = cell;
		this.InitPosition(this._cell.GetBoundingBox().GetPosition());
	}
	public GetBoundingBox(): BoundingBox {
		return this._cell.GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}
	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		this.SetProperty(SvgArchive.flagCell, (s) => {
			if (s.alpha < 0) {
				this._isIncreasingOpacity = true;
			}

			if (1 <= s.alpha) {
				this._isIncreasingOpacity = false;
			}

			s.alpha += this._isIncreasingOpacity ? 0.07 : -0.07;
		});
	}
}
