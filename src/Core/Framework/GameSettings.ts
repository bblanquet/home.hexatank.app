export class GameSettings {
	public static TurrelRotatingDuration: number = 1000;
	public static RotatingDuration: number = 1000; //0.05
	public static TranslatinDuration: number = 3000; //1
	public static MissileTranslationSpeed: number = 5;

	public static DiamondLoading: number = 300; //30
	public static FarmLoading: number = 500; //10

	public static UnitLife: number = 20; //100
	public static NatureLife: number = 40; //100
	public static TurrelCoolingDown: number = 3000; //100
	public static Fire: number = 10;

	public static TankPrice: number = 8;
	public static TruckPrice: number = 4;
	public static FieldPrice: number = 2;

	public static GetFastestRotation(): number {
		return 300;
	}

	public static GetFastestTranslation(): number {
		return 500;
	}

	public static Size: number = 50;

	public static PocketMoney: number = 20;
	public static MapSize: number = 0;

	public static Init(): void {
		this.Size = 50;
		this.MissileTranslationSpeed = 5;
		this.Fire = 10;
		this.TankPrice = 8;
		this.TruckPrice = 4;
		this.FieldPrice = 2;
		this.PocketMoney = 20;
	}

	public static SetNormalSpeed(): void {
		this.TurrelRotatingDuration = 1000;
		this.RotatingDuration = 1000;
		this.TranslatinDuration = 1000;
		this.MissileTranslationSpeed = 5;

		this.DiamondLoading = 300;
		this.FarmLoading = 5000;

		this.UnitLife = 100;
		this.NatureLife = 40;
		this.TurrelCoolingDown = 3000;
		this.Fire = 10;
	}

	public static SetFastSpeed(): void {
		this.TurrelRotatingDuration = 100;
		this.RotatingDuration = 100;
		this.TranslatinDuration = 100;
		this.MissileTranslationSpeed = 5;

		this.DiamondLoading = 75;
		this.FarmLoading = 500;

		this.UnitLife = 100;
		this.NatureLife = 40;
		this.TurrelCoolingDown = 500;
		this.Fire = 50;
	}
}
