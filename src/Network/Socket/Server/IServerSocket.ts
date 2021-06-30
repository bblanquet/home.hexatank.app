import { INetworkMessage } from '../../Message/INetworkMessage';
import { NetworkObserver } from '../../../Utils/Events/NetworkObserver';

export interface IServerSocket {
	On(obs: NetworkObserver[]): void;
	Off(obs: NetworkObserver[]): void;
	Emit(packet: INetworkMessage): void;
	Close(): void;
	Connect(): void;
}
