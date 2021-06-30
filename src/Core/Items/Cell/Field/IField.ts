import { Cell } from '../Cell';
import { Vehicle } from '../../Unit/Vehicle';
import { Identity } from '../../Identity';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { Item } from '../../Item';

export interface IField {
	OnDestroyed: LiteEvent<Item>;
	Destroy(): void;
	Support(vehicule: Vehicle): void;
	IsDesctrutible(): boolean;
	IsBlocking(): boolean;
	GetCell(): Cell;
	GetIdentity(): Identity;
	SetPowerUp(vehicule: Vehicle): void;
}
