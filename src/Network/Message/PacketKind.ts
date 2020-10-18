export enum PacketKind {
	//reseting peer connection
	Reset,

	//connecting
	Candidate,
	Offer,

	//setup
	Join,
	Joined,
	Close,
	Players,
	Available,
	Exist,
	Rooms,
	Leave,

	//general
	OneWayPing,
	TwoWayPing,
	Ping,
	TimeOut,
	Synchronised,
	Context,
	Toast,
	Ready,
	Message,
	Kick,
	Hide,

	//game
	Start,
	Loading,
	Loaded,
	Map,
	UnitDestroyed,
	UnitCreated,
	Target,
	Overlocked,
	PowerChanged,
	Camouflage,
	OrderChanging,
	NextCell,
	FieldChanged
}
