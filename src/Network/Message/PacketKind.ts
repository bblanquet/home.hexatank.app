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
	Context,
	Toast,
	Ready,
	Kick,
	Hide,

	//game
	Start,
	Loading,
	Loaded,
	Blueprint,
	VehicleDestroyed,
	VehicleCreated,
	FieldDestroyed,
	Target,
	Overclocked,
	PowerChanged,
	Camouflage,
	PathChanged,
	FieldChanged,
	SyncStart,
	SyncLoaded,
	SyncBlueprint
}
