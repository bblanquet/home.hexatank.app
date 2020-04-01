import { Headquarter } from './../Items/Cell/Field/Headquarter';
import { CellContext } from '../Items/Cell/CellContext';
import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { Vehicle } from './../Items/Unit/Vehicle';
import { Cell } from '../Items/Cell/Cell';
import { Tank } from '../Items/Unit/Tank';
import { PeerHandler } from '../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../Components/Network/PacketKind';

export class GameContext {
	private _vehicleCount: number = 0;
	private _vehicles: Dictionnary<Vehicle> = new Dictionnary<Vehicle>();
	private _cells: CellContext<Cell>;
	private _hqs: Headquarter[];
	public MainHq: Headquarter;

	public SetHqs(hqs: Headquarter[]) {
		this._hqs = hqs;
		this._hqs.forEach((hq) => {
			hq.OnVehiculeCreated.On(this.VehiculeCreated.bind(this));
		});
	}

	public SetCells(cells: CellContext<Cell>): void {
		this._cells = cells;
	}

	private VehiculeCreated(obj: Headquarter, vehicule: Vehicle): void {
		vehicule.Id = `${obj.PlayerName}${this._vehicleCount}`;
		this._vehicles.Add(vehicule.Id, vehicule);

		PeerHandler.SendMessage(PacketKind.Create, {
			Type: vehicule instanceof Tank ? 'Tank' : 'Truck',
			Id: vehicule.Id,
			cell: vehicule.GetCurrentCell().GetCoordinate(),
			Hq: obj.GetCell().GetCoordinate()
		});
	}

	public Destroy(): void {
		this._hqs.forEach((hq) => {
			hq.OnVehiculeCreated.Clear();
		});
	}
}
