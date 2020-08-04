import { Area } from '../Utils/Area';

export interface IExpansionMaker {
	Expand(): void;
	CreateArea(area: Area): void;
	RemoveArea(area: Area): void;
}
