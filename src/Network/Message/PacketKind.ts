export enum PacketKind {
	connect,
	reconnect,
	connect_error,
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
	Error,

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
	Damaged,
	FieldDamaged,
	FieldChanged,
	SyncStart,
	SyncLoaded,
	SyncBlueprint
}
