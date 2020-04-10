import { Cell } from '../Cell';
import { Field } from './Field';
import { CellState } from '../CellState';
import { Archive } from '../../../Framework/ResourceArchiver';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { Vehicle } from '../../Unit/Vehicle';
import { GameSettings } from '../../../Framework/GameSettings';

export class FastField extends Field {
	constructor(cell: Cell) {
		super(cell);
		this.GetCell().SetField(this);
		this.Z = 1;

		this.GenerateSprite(Archive.bonus.speed);
		this.InitPosition(cell.GetBoundingBox());
		this.GetDisplayObjects().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	protected OnCellStateChanged(cellState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
	}

	Support(vehicule: Vehicle): void {
		const sum = this.GetInfluenceSum(vehicule);
		vehicule.TranslationSpeed = GameSettings.TranslationSpeed * (2 + sum);
		vehicule.RotationSpeed = GameSettings.RotationSpeed * (2 + sum);
		vehicule.Attack = GameSettings.Attack;
	}

	IsDesctrutible(): boolean {
		return false;
	}
	IsBlocking(): boolean {
		return false;
	}
}
