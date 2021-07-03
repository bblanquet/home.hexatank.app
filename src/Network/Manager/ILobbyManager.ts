import { BlueprintSetup } from '../../UI/Components/Form/BlueprintSetup';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Message } from '../../UI/Model/Message';
export interface ILobbyManager {
	OnMessageReceived: LiteEvent<Message>;
	OnKicked: SimpleEvent;
	OnStarting: SimpleEvent;

	GetSetup(): BlueprintSetup;
	SendMessage(content: string): void;
	Kick(playerName: string): void;
	SetReady(): void;
	Start(): void;
	Clear(): void;
	Stop(): void;
}
