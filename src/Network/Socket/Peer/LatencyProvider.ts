import * as luxon from 'luxon';
import { LogKind } from '../../../Core/Utils/Logger/LogKind';
import { StaticLogger } from '../../../Core/Utils/Logger/StaticLogger';
import { INetworkMessage } from '../../Message/INetworkMessage';
import { JetlagData } from './Ping/JetlagData';
export class LatencyProvider {
	private _shortestLatency: number | null = null;
	//example Device A = > UTC +5H and Device B => UTC +3 so jetlag = 2H
	private _jetLag: number | null = null;
	private _jetlagSign: boolean | null = null;

	constructor() {}

	public CalculateLatency(data: JetlagData) {
		if (this._shortestLatency === null || data.Latency < this._shortestLatency) {
			this._shortestLatency = data.Latency;
			this._jetlagSign = data.JetlagSign;
			this._jetLag = data.Jetlag;
		}
	}

	public GetLatency(packet: INetworkMessage): number {
		if (this._jetLag !== null) {
			let calculatedEmittedDate = this._jetlagSign
				? packet.EmittedDate - this._jetLag
				: packet.EmittedDate + this._jetLag;
			const now = new Date().getTime();
			let latency = 0;
			if (calculatedEmittedDate < now) {
				latency = now - calculatedEmittedDate;
			} else {
				StaticLogger.Log(
					LogKind.warning,
					`negative LAT ${luxon.Duration.fromMillis(latency).toFormat('ss.SSS')}`
				);
			}

			StaticLogger.Log(LogKind.info, `LAT ${luxon.Duration.fromMillis(latency).toFormat('ss.SSS')}`);
			return latency;
		}
		return 0;
	}
}
