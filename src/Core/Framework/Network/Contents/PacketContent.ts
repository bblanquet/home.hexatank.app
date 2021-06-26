export class PacketContent<T> {
	//vehicle id
	public VId: string;
	//cell id
	public CId: string;
	//player id
	public Id: string;
	//value type (tank, truck, FireCell...)
	public Type: string;
	public Extra: T;
}
