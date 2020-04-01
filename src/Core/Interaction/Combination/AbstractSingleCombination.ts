import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { ILiteEvent } from '../../Utils/Events/ILiteEvent';
import { Item } from '../../Items/Item';
import { LiteEvent } from '../../Utils/Events/LiteEvent';

export abstract class AbstractSingleCombination implements ICombination {
	public OnClearContext: SimpleEvent = new SimpleEvent();
	public OnChangedMode: ILiteEvent<InteractionMode> = new LiteEvent<InteractionMode>();
	public OnPushedItem: ILiteEvent<{ item: Item; isForced: boolean }> = new LiteEvent<{
		item: Item;
		isForced: boolean;
	}>();

	public abstract IsMatching(context: CombinationContext): boolean;
	public abstract Combine(context: CombinationContext): boolean;

	protected IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}
}
