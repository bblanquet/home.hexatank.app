export interface ISpot<T extends ISpot<T>> {
	GetUnblockedRange(): Array<T>;
	GetFilteredNearby(condition: (spot: T) => boolean): Array<T>;
	GetDistance(spot: T): number;
	IsEqualed(spot: T): boolean;
}
