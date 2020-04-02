import { Item } from '../../Items/Item';
import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';

export class SpeedFieldMenuItem extends Item {
	public GetBoundingBox(): BoundingBox {
		throw new Error('Method not implemented.');
	}
	public Select(context: IInteractionContext): boolean {
		throw new Error('Method not implemented.');
	}
	constructor() {
		super(false);
	}
}
