import { BlueprintSetup } from '../../Components/Model/BlueprintSetup';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Message } from '../../Components/Model/Message';
export interface ILobbyManager {
	OnMessageReceived: LiteEvent<Message>;
	OnKicked: SimpleEvent;
	OnStarting: SimpleEvent;

	GetSetup(): BlueprintSetup;
	SendMessage(content: string): void;
	SetReady(): void;
	SendReadyState(): void;
	Start(): void;
	Clear(): void;
	Stop(): void;
	Kick(playerName: string): void;
}
