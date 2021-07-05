import { RoomState } from './RoomState';

export class GuestState {
	Rooms: RoomState[];
	DisplayableRooms: RoomState[];
	PlayerName: string;
	filter: string;
	Password: string;
}
