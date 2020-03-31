import { SimpleEvent } from './../../Utils/Events/SimpleEvent';
import { ILiteEvent } from './../../Utils/Events/ILiteEvent';
import { CombinationContext } from './CombinationContext';
import { Item } from '../../Items/Item';
import { InteractionMode } from '../InteractionMode';

export interface ICombination {
	IsMatching(context: CombinationContext): boolean;
	Combine(context: CombinationContext): boolean;
	OnClearContext: SimpleEvent;
	OnChangedMod: ILiteEvent<InteractionMode>;
	OnPushedItem: ILiteEvent<Item>;
}
