import { DecoratingElement } from './DecoratingElement';
import { Decorator } from './Decorator';
import { DecorationType } from '../../../Framework/Blueprint/Items/DecorationType';
export class SandDecorator extends Decorator {
	constructor() {
		super();
		this.BlockingCells = [
			new DecoratingElement(DecorationType.SandRock),
			new DecoratingElement(DecorationType.palmTree),
			new DecoratingElement(DecorationType.SandCactus),
			new DecoratingElement(DecorationType.Water)
		];

		this.DecorationCells = [
			new DecoratingElement(DecorationType.SandStone),
			new DecoratingElement(DecorationType.SandCactusPlants),
			new DecoratingElement(DecorationType.Bush),
			new DecoratingElement(DecorationType.SandPlants),
			new DecoratingElement(DecorationType.WhiteSkull)
		];
	}
}
