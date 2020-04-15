import { DecoratingElement } from './DecoratingElement';
import { Decorator } from './Decorator';
import { DecorationType } from '../../../Setup/Generator/DecorationType';
export class SandDecorator extends Decorator {
	constructor() {
		super();
		this._blockingCells = [
			new DecoratingElement(DecorationType.SandRock),
			new DecoratingElement(DecorationType.palmTree),
			new DecoratingElement(DecorationType.Water)
		];

		this._decorationCells = [
			new DecoratingElement(DecorationType.SandStone),
			new DecoratingElement(DecorationType.Bush),
			new DecoratingElement(DecorationType.SandPlants),
			new DecoratingElement(DecorationType.WhiteSkull)
		];
	}
}
