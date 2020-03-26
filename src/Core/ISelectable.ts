import { LiteEvent } from './Utils/Events/LiteEvent';

export interface ISelectable {
	SetSelected(visible: boolean): void;
	IsSelected(): boolean;
	SelectionChanged: LiteEvent<ISelectable>;
}
