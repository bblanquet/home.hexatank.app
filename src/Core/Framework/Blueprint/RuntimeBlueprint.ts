import { GameContext } from '../Context/GameContext';
import { IRuntimeBlueprint } from './IRuntimeBlueprint';
import { CellPrint } from './Items/CellPrint';
import { VehiclePrint } from './Items/VehiclePrint';

export class RuntimeBlueprint implements IRuntimeBlueprint {
	public Cells: CellPrint[];
	public Vehicles: VehiclePrint[];

	public static New(context: GameContext): RuntimeBlueprint {
		const blueprint = new RuntimeBlueprint();
		blueprint.Cells = context.GetCells().map((c) => CellPrint.NewFromCell(c));
		blueprint.Vehicles = context.GetVehicles().map((v) => VehiclePrint.New(v));
		return blueprint;
	}
}
