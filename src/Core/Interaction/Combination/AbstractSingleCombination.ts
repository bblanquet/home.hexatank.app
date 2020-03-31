import { ICombination } from './ICombination';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
export class AbstractSingleCombination implements ICombination {
	public IsMatching(context: CombinationContext): boolean {
		throw new Error('Method not implemented.');
	}
	public Combine(context: CombinationContext): boolean {
		throw new Error('Method not implemented.');
	}

	protected IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}
}
