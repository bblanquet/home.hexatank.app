import { SimpleEvent } from '../Utils/Events/SimpleEvent';
import { ConnectionStatus } from './ConnectionStatus';
export class OnlinePlayer {
	public Name: string;

	private _connection: ConnectionStatus;
	private _hasTimeout: boolean = false;
	private _timeoutDate: number = 0;
	private _latency: string;

	public IsLoaded: boolean;
	public IsReady: boolean;
	public IsAdmin: boolean;
	private _isSync: boolean;

	public OnChanged: SimpleEvent = new SimpleEvent();

	constructor(name: string) {
		this.Name = name;
		this._latency = '0';
		this.IsLoaded = false;
		this.IsReady = false;
		this._isSync = true;
		this._connection = new ConnectionStatus();
	}

	public IsSync(): boolean {
		return this._isSync;
	}

	public SetSync(value: boolean): void {
		this._isSync = value;
	}

	public GetLatency(): string {
		return this._latency;
	}

	public SetLatency(latency: string): void {
		this._latency = latency;
		this.OnChanged.Invoke();
	}

	public HasTimeOut(): boolean {
		return this._hasTimeout;
	}

	public GetTimeOutDuration(): number {
		if (this._timeoutDate) {
			return Date.now() - this._timeoutDate;
		} else {
			return 0;
		}
	}

	public GetConnection(): ConnectionStatus {
		return this._connection;
	}

	public SetTimeOut(hasTimeOut: boolean): void {
		this._hasTimeout = hasTimeOut;
		if (this._hasTimeout) {
			this._timeoutDate = Date.now();
			this._latency = '-';
		} else {
			this._timeoutDate = 0;
		}
		this.OnChanged.Invoke();
	}

	public SetConnection(connection: ConnectionStatus): void {
		this._connection = connection;
		this.OnChanged.Invoke();
	}
}
