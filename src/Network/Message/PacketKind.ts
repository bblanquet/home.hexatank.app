export enum PacketKind {
	//reseting peer connection
	Reset,
	//connecting
	Candidate,
	Offer,
	//setup game event
	Join,
	Joined,
	Close,
	Players,
	Available,
	Exist,
	Rooms,
	Leave,
	//game
	OneWayPing,
	TwoWayPing,
	Ping,
	Synchronised,
	Context,
	Toast,
	Ready,
	Message,
	Kick,
	Hide,
	//more
	Map
}
