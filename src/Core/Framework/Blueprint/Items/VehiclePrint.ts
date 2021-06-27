import { Truck } from '../../../Items/Unit/Truck';
import { Vehicle } from '../../../Items/Unit/Vehicle';

export class VehiclePrint {
	public VId: string;
	public Id: string;
	public CId: string;
	public NextCId: string;
	public Path: string[];
	public Type: string;

	public static New(v: Vehicle): VehiclePrint {
		const print = new VehiclePrint();
		print.Type = v instanceof Truck ? 'Truck' : 'Tank';
		print.VId = v.Id;
		print.Id = v.Identity.Name;
		print.CId = v.GetCurrentCell().Coo();
		print.NextCId = v.HasNextCell() ? v.GetNextCell().Coo() : '';
		print.Path = v.HasOrder() ? v.GetCurrentPath().map((c) => c.Coo()) : [];
		return print;
	}
}
