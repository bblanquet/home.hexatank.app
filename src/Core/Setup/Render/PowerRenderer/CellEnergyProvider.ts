import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { ICellEnergyProvider } from './../../../Items/Cell/Field/Hq/ICellEnergyProvider';
export class CellEnergyProvider implements ICellEnergyProvider {
	GetCellEnergy(coo: HexAxial): number {
		return 1;
	}
}
