import { SimpleEvent } from './../../../Utils/Events/SimpleEvent';
import { ILiteEvent } from './../../../Utils/Events/ILiteEvent';
import { CombinationContext } from './CombinationContext';
import { Item } from '../../Items/Item';

export interface ICombination {
	IsMatching(context: CombinationContext): boolean;
	Combine(context: CombinationContext): boolean;
	ClearContext: SimpleEvent;
	ForcingSelectedItem: ILiteEvent<{ item: Item; isForced: boolean }>;
}
