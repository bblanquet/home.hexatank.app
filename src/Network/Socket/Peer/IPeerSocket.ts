import { LiteEvent } from '../../../Core/Utils/Events/LiteEvent';
import { SimpleEvent } from '../../../Core/Utils/Events/SimpleEvent';
import { ConnectionStatus } from '../../ConnectionStatus';
import { INetworkMessage } from '../../Message/INetworkMessage';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { PingData } from './Ping/PingData';

export interface IPeerSocket {
	OnShutdown: SimpleEvent;
	OnStateChanged: LiteEvent<ConnectionStatus>;
	OnReceivedMessage: LiteEvent<NetworkMessage<any>>;
	Send(message: INetworkMessage): void;
	GetLastPing(): PingData;
	IsShutDown(): boolean;
	ShutDown(): void;
	GetConnectionStatus(): ConnectionStatus;
}
