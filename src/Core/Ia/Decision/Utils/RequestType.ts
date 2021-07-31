export enum RequestType {
	None = 'None',

	//powerup
	SpeedUp = 'SpeedUp',
	FireUp = 'FireUp',
	HealUp = 'HealUp',

	//field
	FarmField = 'FarmField',
	MedicField = 'MedicField',
	BatteryField = 'BatteryField',
	ShieldField = 'ShieldField',
	ReactorShield = 'ReactorShield',
	ReactorField = 'ReactorField',
	RoadField = 'RoadField',
	BorderShieldField = 'BorderShieldField',

	//unit
	Tank = 'Tank',
	Truck = 'Truck',

	//behaviour
	Clear = 'Clear',
	Patrol = 'Patrol',
	IdleTruck = 'IdleTruck',
	Defense = 'Defense',
	HealUnit = 'HealUnit',
	Raid = 'Raid',
	DiamondRoad = 'DiamondRoad',
	FoeReactor = 'FoeReactor',
	DiamondRoadCleaning = 'DiamondRoadCleaning'
}
