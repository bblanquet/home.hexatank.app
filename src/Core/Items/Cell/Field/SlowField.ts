import { Cell } from '../Cell';
import { Field } from './Field';
import { CellState } from '../CellState';
import { Archive } from '../../../Framework/ResourceArchiver';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { Vehicle } from '../../Unit/Vehicle';
import { GameSettings } from '../../../Framework/GameSettings';

export class SlowField extends Field {
	constructor(ceil: Cell) {
		super(ceil);
		this.GetCell().SetField(this);
		this.Z = 1;

		this.GenerateSprite(Archive.bonus.slow);
		this.InitPosition(ceil.GetBoundingBox());
		this.GetDisplayObjects().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	protected OnCellStateChanged(ceilState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
			s.visible = ceilState !== CellState.Hidden;
		});
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}
	Support(vehicule: Vehicle): void {
		const sum = this.GetInfluenceSum(vehicule);
		vehicule.TranslationSpeed = GameSettings.TranslationSpeed * (0.8 * (1 / sum));
		vehicule.RotationSpeed = GameSettings.RotationSpeed * (0.8 * (1 / sum));
		vehicule.Attack = GameSettings.Attack;
	}

	IsDesctrutible(): boolean {
		return false;
	}
	IsBlocking(): boolean {
		return false;
	}
}
