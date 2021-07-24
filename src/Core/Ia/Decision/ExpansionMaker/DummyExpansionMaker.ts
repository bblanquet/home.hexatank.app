import { IExpansionMaker } from './IExpansionMaker';
import { Area } from '../Utils/Area';

export class DummyExpansionMaker implements IExpansionMaker {
	constructor() {}
	Expand(): void {}
	CreateArea(area: Area): void {}
	RemoveArea(area: Area): void {}
}
