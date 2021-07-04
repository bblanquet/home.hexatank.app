import { BlueprintSetup } from '../../Ui/Components/Form/BlueprintSetup';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Message } from '../../Ui/Model/Message';
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
