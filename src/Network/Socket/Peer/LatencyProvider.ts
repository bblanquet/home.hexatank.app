import * as moment from 'moment';
import { INetworkMessage } from '../../Message/INetworkMessage';
import { PingData } from './Ping/PingData';
export class LatencyProvider {
	private _shortestLatency: number | null = null;
	private _dateDelta: number | null = null;
	private _deltaSign: boolean | null = null;

	constructor() {}

	public CalculateLatency(data: PingData) {
		if (this._shortestLatency === null || data.Latency < this._shortestLatency) {
			this._shortestLatency = data.Latency;
			this._deltaSign = data.DeltaSign;
			this._dateDelta = moment.duration(data.DateDelta).asMilliseconds();
		}
	}

	public GetLatency(packet: INetworkMessage): number {
		if (this._dateDelta !== null) {
			let deviceRefEmittedDate: number = null;
			if (this._deltaSign) {
				deviceRefEmittedDate = moment(packet.EmittedDate)
					.subtract(moment.duration(this._dateDelta, 'milliseconds'))
					.toDate()
					.getTime();
			} else {
				deviceRefEmittedDate = moment(packet.EmittedDate)
					.add(moment.duration(this._dateDelta, 'milliseconds'))
					.toDate()
					.getTime();
			}
			const now = new Date().getTime();
			const messageLatency = moment.duration(now - deviceRefEmittedDate);
			console.log(`Message Latency ${moment.utc(messageLatency.asMilliseconds()).format('HH:mm:ss.SSS')}`);
			return messageLatency.asMilliseconds();
		}
		return 0;
	}
}
