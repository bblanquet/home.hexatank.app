import { BlueprintSetup } from '../../UI/Components/Form/BlueprintSetup';
import { SimpleEvent } from '../../Core/Utils/Events/SimpleEvent';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { Message } from '../../UI/Screens/Network/Message';
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
