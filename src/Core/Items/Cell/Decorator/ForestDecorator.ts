import { DecoratingElement } from './DecoratingElement';
import { Decorator } from './Decorator';
import { DecorationType } from '../../../Framework/Blueprint/Items/DecorationType';

export class ForestDecorator extends Decorator {
	constructor() {
		super();
		this.BlockingCells = [
			new DecoratingElement(DecorationType.Rock),
			new DecoratingElement(DecorationType.Tree),
			new DecoratingElement(DecorationType.DarkTree),
			new DecoratingElement(DecorationType.Water),
			new DecoratingElement(DecorationType.Volcano, 1)
		];

		this.DecorationCells = [
			new DecoratingElement(DecorationType.Stone),
			new DecoratingElement(DecorationType.Bush),
			new DecoratingElement(DecorationType.Leaf),
			new DecoratingElement(DecorationType.Leaf2)
		];
	}
}
