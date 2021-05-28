import { HexAxial } from '../../../../Utils/Geometry/HexAxial';

export interface ICellEnergyProvider {
	GetCellEnergy(coo: HexAxial): number;
}
