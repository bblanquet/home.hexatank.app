import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { ILiteEvent } from '../../Utils/Events/ILiteEvent';
import { Item } from '../../Items/Item';

export abstract class AbstractSingleCombination implements ICombination {
	public OnClearContext: SimpleEvent;
	public OnChangedMod: ILiteEvent<InteractionMode>;
	public OnPushedItem: ILiteEvent<Item>;

	public abstract IsMatching(context: CombinationContext): boolean;
	public abstract Combine(context: CombinationContext): boolean;

	protected IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}
}
