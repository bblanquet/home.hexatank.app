export interface ISpot<T extends ISpot<T>> {
	GetNearby(): Array<T>;
	GetFilterNeighbourhood(condition: (spot: T) => boolean): Array<T>;
	GetDistance(spot: T): number;
	IsEqualed(spot: T): boolean;
}
