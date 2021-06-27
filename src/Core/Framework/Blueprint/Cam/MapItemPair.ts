import { CellPrint } from '../Items/CellPrint';
export class MapItemPair {
	Departure: CellPrint;
	Arrival: CellPrint;
	constructor() {}

	public static New(departure: CellPrint, arrival: CellPrint): MapItemPair {
		const mapitemPair = new MapItemPair();
		mapitemPair.Arrival = arrival;
		mapitemPair.Departure = departure;
		return mapitemPair;
	}
}
