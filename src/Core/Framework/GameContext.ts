import { Headquarter } from './../Items/Cell/Field/Headquarter';
import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { Vehicle } from './../Items/Unit/Vehicle';
import { Tank } from '../Items/Unit/Tank';
import { PeerHandler } from '../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../Components/Network/PacketKind';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import { Item } from '../Items/Item';

export class GameContext {
	private _vehicleCount: number = 0;
	private _vehicles: Dictionnary<Vehicle> = new Dictionnary<Vehicle>();
	private _hqs: Headquarter[];
	public MainHq: Headquarter;
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();

	public SetHqs(hqs: Headquarter[]) {
		this._hqs = hqs;
		this._hqs.forEach((hq) => {
			hq.OnVehiculeCreated.On(this.VehiculeCreated.bind(this));
		});
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
