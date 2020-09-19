import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { InteractionKind } from '../IInteractionContext';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { ILiteEvent } from '../../Utils/Events/ILiteEvent';
import { Item } from '../../Items/Item';
import { LiteEvent } from '../../Utils/Events/LiteEvent';

export abstract class AbstractSingleCombination implements ICombination {
	public ClearContext: SimpleEvent = new SimpleEvent();
	public ForcingSelectedItem: ILiteEvent<{ item: Item; isForced: boolean }> = new LiteEvent<{
		item: Item;
		isForced: boolean;
	}>();

	public abstract IsMatching(context: CombinationContext): boolean;
	public abstract Combine(context: CombinationContext): boolean;

	protected IsNormalMode(context: CombinationContext) {
		return context.InteractionKind === InteractionKind.Up;
	}
}
