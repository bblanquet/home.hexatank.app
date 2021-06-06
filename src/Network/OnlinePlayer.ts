import { SimpleEvent } from '../Core/Utils/Events/SimpleEvent';
import { ConnectionStatus } from './ConnectionStatus';
export class OnlinePlayer {
	public Name: string;

	private _connection: ConnectionStatus;
	private _hasTimeout: boolean = false;
	private _latency: string;

	public IsLoaded: boolean;
	public IsReady: boolean;
	public IsAdmin: boolean;

	public OnChanged: SimpleEvent = new SimpleEvent();

	constructor(name: string) {
		this.Name = name;
		this._latency = '0';
		this.IsLoaded = false;
		this.IsReady = false;
		this._connection = new ConnectionStatus();
	}

	public GetLatency(): string {
		return this._latency;
	}

	public HasTimeOut(): boolean {
		return this._hasTimeout;
	}

	public GetConnection(): ConnectionStatus {
		return this._connection;
	}

	public SetLatency(latency: string): void {
		this._latency = latency;
		this.OnChanged.Invoke();
	}

	public SetTimeOut(hasTimeOut: boolean): void {
		this._hasTimeout = hasTimeOut;
		if (this._hasTimeout) {
			this._latency = '-';
		}
		this.OnChanged.Invoke();
	}

	public SetConnection(connection: ConnectionStatus): void {
		this._connection = connection;
		this.OnChanged.Invoke();
	}
}
