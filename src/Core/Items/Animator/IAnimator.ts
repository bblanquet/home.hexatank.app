import { IUpdatable } from './../../IUpdatable';

export interface IAnimator extends IUpdatable {
	IsDone: boolean;
	Reset(): void;
}
