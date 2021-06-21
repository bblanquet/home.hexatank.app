import { Cell } from '../Cell';
import { Vehicle } from '../../Unit/Vehicle';
import { Identity } from '../../Identity';

export interface IField {
	Support(vehicule: Vehicle): void;
	IsDesctrutible(): boolean;
	IsBlocking(): boolean;
	GetCell(): Cell;
	GetIdentity(): Identity;
	SetPowerUp(vehicule: Vehicle): void;
}
