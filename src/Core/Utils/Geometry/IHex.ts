export interface IHex<T extends IHex<T>> {
	GetNeighbourhood(): Array<T>;
	GetFilterNeighbourhood(filter: (cell: T) => boolean): Array<T>;
	GetDistance(item: T): number;
	IsEqualed(item: T): boolean;
}
