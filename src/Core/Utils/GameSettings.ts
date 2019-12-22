export class GameSettings
{
    public static Size:number=50;
    public static ScreenWidth:number; 
    public static ScreenHeight:number;
    public static RotationSpeed:number=0.05;
    public static TurrelRotationSpeed:number=0.2;
    public static TranslationSpeed:number=1;
    public static MissileTranslationSpeed:number=5;
    public static IsPause:boolean=false;
    public static ShowEnemies:boolean=false;
    public static Attack:number=10;
    public static TankPrice:number=8;
    public static TruckPrice:number=4;
    public static FieldPrice:number=2;
    public static PocketMoney:number=20;
    public static MapSize: number=0;

    public static Init():void{
        this.Size=50;
        this.ScreenWidth; 
        this.ScreenHeight;
        this.RotationSpeed=0.05;
        this.TurrelRotationSpeed=0.2;
        this.TranslationSpeed=1;
        this.MissileTranslationSpeed=5;
        this.IsPause=false;
        this.ShowEnemies=false;
        this.Attack=10;
        this.TankPrice=8;
        this.TruckPrice=4;
        this.FieldPrice=2;
        this.PocketMoney=20;
        this.MapSize=0;
    }
}