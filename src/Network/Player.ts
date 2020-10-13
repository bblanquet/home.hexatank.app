import { ConnectionStatus } from './ConnectionStatus';
export class Player {
	public Name: string;
	public Latency: string;
	public Delta: number | null;
	public Connection: ConnectionStatus;

	public IsLoaded: boolean;
	public IsReady: boolean;

	constructor(name: string) {
		this.Name = name;
		this.Latency = '0';
		this.Delta = null;
		this.IsLoaded = false;
		this.IsReady = false;

		this.Connection = new ConnectionStatus();
	}
}
