import { GameSettings } from '../../../Framework/GameSettings';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { Cell } from '../Cell';
import { Field } from './Field';
import { Vehicle } from '../../Unit/Vehicle';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';

export class BasicField extends Field {
	constructor(cell: Cell) {
		super(cell);
		this.GetCell().SetField(this);
	}

	Support(vehicule: Vehicle): void {
		vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
		vehicule.RotationSpeed = GameSettings.RotationSpeed;
		vehicule.Attack = GameSettings.Attack;
	}

	IsDesctrutible(): boolean {
		return false;
	}

	IsBlocking(): boolean {
		return false;
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}
	public Update(viewX: number, viewY: number): void {}
}
