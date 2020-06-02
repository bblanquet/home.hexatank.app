import { Item } from '../../Items/Item';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { IInteractionContext } from '../../Interaction/IInteractionContext';

export class MultiOrderMenuItem extends Item {
	public GetBoundingBox(): BoundingBox {
		throw new Error('Method not implemented.');
	}
	public Select(context: IInteractionContext): boolean {
		throw new Error('Method not implemented.');
	}
	constructor() {
		super(false);
	}
	SetSelected(visible: boolean): void {
		throw new Error('Method not implemented.');
	}
	IsSelected(): boolean {
		throw new Error('Method not implemented.');
	}
}
