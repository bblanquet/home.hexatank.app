import { Item } from '../../Items/Item';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { IInteractionContext } from '../../Interaction/IInteractionContext';

export class ActiveMenuItem extends Item {
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
