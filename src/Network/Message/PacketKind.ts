export enum PacketKind {
	connect,
	connect_error,
	connection,
	disconnect,
	Remove,
	Create,

	//reseting peer connection
	Reset,

	//connecting
	Candidate,
	Offer,

	//setup
	Password,
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
