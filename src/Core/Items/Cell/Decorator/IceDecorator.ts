import { DecoratingElement } from './DecoratingElement';
import { Decorator } from './Decorator';
import { DecorationType } from '../../../Framework/Blueprint/Items/DecorationType';

export class IceDecorator extends Decorator {
	constructor() {
		super();
		this.BlockingCells = [
			new DecoratingElement(DecorationType.IceRock),
			new DecoratingElement(DecorationType.IceTree),
			new DecoratingElement(DecorationType.IceTree2),
			new DecoratingElement(DecorationType.Volcano, 1)
		];

		this.DecorationCells = [
			new DecoratingElement(DecorationType.IceStone),
			new DecoratingElement(DecorationType.IcePlants),
			new DecoratingElement(DecorationType.IcePlants2)
		];
	}
}
