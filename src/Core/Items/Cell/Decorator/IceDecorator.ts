import { DecoratingElement } from './DecoratingElement';
import { Decorator } from './Decorator';
import { DecorationType } from '../../../Setup/Generator/DecorationType';

export class IceDecorator extends Decorator {
	constructor() {
		super();
		this._blockingCells = [
			new DecoratingElement(DecorationType.IceRock),
			new DecoratingElement(DecorationType.IceTree),
			new DecoratingElement(DecorationType.Volcano, 1)
		];

		this._decorationCells = [
			new DecoratingElement(DecorationType.IceStone),
			new DecoratingElement(DecorationType.Bush)
		];
	}
}
