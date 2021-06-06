import { LiteEvent } from './../../../../Core/Utils/Events/LiteEvent';
export interface IServerPinger<T> {
	OnReceived: LiteEvent<T>;
	Start(value: T): void;
	Stop(): void;
}
