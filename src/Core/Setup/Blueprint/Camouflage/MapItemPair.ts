import { MapItem } from './../MapItem';
export class MapItemPair {
	Departure: MapItem;
	Arrival: MapItem;
	constructor() {}

	public static Create(departure: MapItem, arrival: MapItem): MapItemPair {
		const mapitemPair = new MapItemPair();
		mapitemPair.Arrival = arrival;
		mapitemPair.Departure = departure;
		return mapitemPair;
	}
}
