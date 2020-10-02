import { ConnectionStatus } from './ConnectionStatus';
export class Player {
	public Name: string;
	public Latency: string;
	public Connection: ConnectionStatus;

	public IsLoaded: boolean;
	public IsReady: boolean;

	constructor(name: string) {
		this.Name = name;
		this.Latency = '0';
		this.IsLoaded = false;
		this.IsReady = false;

		this.Connection = new ConnectionStatus();
	}
}
