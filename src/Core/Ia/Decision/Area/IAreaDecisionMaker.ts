import { IaArea } from '../Utils/IaArea';

export interface IAreaDecisionMaker {
	IsDestroyed(): boolean;
	Destroy(): void;
	Update(): void;
	Area: IaArea;
	HasReceivedRequest: boolean;
}
