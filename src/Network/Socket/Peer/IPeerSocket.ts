import { LiteEvent } from '../../../Core/Utils/Events/LiteEvent';
import { SimpleEvent } from '../../../Core/Utils/Events/SimpleEvent';
import { ConnectionStatus } from '../../ConnectionStatus';
import { INetworkMessage } from '../../Message/INetworkMessage';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { JetlagData } from './Ping/JetlagData';

export interface IPeerSocket {
	OnShutdown: SimpleEvent;
	OnStateChanged: LiteEvent<ConnectionStatus>;
	OnReceivedMessage: LiteEvent<NetworkMessage<any>>;
	Send(message: INetworkMessage): void;
	GetLastPing(): JetlagData;
	IsShutDown(): boolean;
	ShutDown(): void;
	GetConnectionStatus(): ConnectionStatus;
}
