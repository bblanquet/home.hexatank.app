import { KingdomArea } from './../Utils/KingdomArea';

export interface IAreaDecisionMaker {
	IsDestroyed(): boolean;
	Destroy(): void;
	Update(): void;
	Area: KingdomArea;
	HasReceivedRequest: boolean;
}
