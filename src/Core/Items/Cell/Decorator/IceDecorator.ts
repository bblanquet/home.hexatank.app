import { DecoratingElement } from './DecoratingElement';
import { Decorator } from './Decorator';
import { DecorationType } from '../../../Setup/Generator/DecorationType';

export class IceDecorator extends Decorator {
	constructor() {
		super();
		this._blockingCells = [
			new DecoratingElement(DecorationType.IceRock),
			new DecoratingElement(DecorationType.IceTree),
			new DecoratingElement(DecorationType.IceTree2),
			new DecoratingElement(DecorationType.Volcano, 1)
		];

		this._decorationCells = [
			new DecoratingElement(DecorationType.IceStone),
			new DecoratingElement(DecorationType.IcePlants),
			new DecoratingElement(DecorationType.IcePlants2)
		];
	}
}
