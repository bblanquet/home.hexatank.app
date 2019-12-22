import { LiteEvent } from '../../Utils/LiteEvent';
import { FlagCeil } from '../FlagCeil';
import { Tank } from '../../Items/Unit/Tank';
import { PacketKind } from './../../../Menu/Network/PacketKind';
import { PeerHandler } from './../../../Menu/Network/Host/On/PeerHandler';
import { InteractionContext } from "../../Context/InteractionContext";
import { Ceil } from "../Ceil";
import { HeadQuarterField } from "./HeadquarterField"; 
import { AliveItem } from "../../Items/AliveItem";
import { IField } from "./IField"; 
import { Crater } from "../../Items/Others/Crater";
import { Archive } from "../../Utils/ResourceArchiver";
import { CeilState } from "../CeilState";
import { BoundingBox } from "../../Utils/BoundingBox";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";
import { HqSkin } from "../../Utils/HqSkin";
import { IHqContainer } from "../../Items/Unit/IHqContainer";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { Explosion } from "../../Items/Unit/Explosion";
import { Truck } from "../../Items/Unit/Truck";
import { SimpleOrder } from '../../Ia/Order/SimpleOrder';
import { GameSettings } from '../../Utils/GameSettings';

export class Headquarter extends AliveItem implements IField
{
    private _boundingBox:BoundingBox;
    private _cell:Ceil; 
    public PlayerName:string;
    public Count:number=0;
    protected Fields:Array<HeadQuarterField>;
    private _diamondCount:number=GameSettings.PocketMoney;
    private _skin:HqSkin;
    private _onCellStateChanged:{(obj:any,ceilState:CeilState):void};
    public FlagCeil:FlagCeil;

    constructor(skin:HqSkin, ceil:Ceil){
        super();
        this._skin = skin;
        this.Z= 2;
        this._cell = ceil;
        this._cell.SetField(this);

        this.GenerateSprite(Archive.selectionUnit);
        this.SetProperty(Archive.selectionUnit,(e)=>e.alpha=0);

        this._boundingBox = new BoundingBox();
        this._boundingBox.Width = this._cell.GetBoundingBox().Width;
        this._boundingBox.Height = this._cell.GetBoundingBox().Height;
        this._boundingBox.X = this._cell.GetBoundingBox().X;
        this._boundingBox.Y = this._cell.GetBoundingBox().Y;

        this.GenerateSprite(this.GetSkin().GetHq());
        this.GenerateSprite(Archive.building.hq.bottom);
        this.GenerateSprite(Archive.building.hq.top);

        this.GetSprites().forEach(obj => {
            obj.width = this._boundingBox.Width;
            obj.height = this._boundingBox.Height;
            obj.anchor.set(0.5);
        });
        this.IsCentralRef = true;

        var neighbours = this._cell.GetNeighbourhood();
        this.Fields = new Array<HeadQuarterField>();
        neighbours.forEach(ceil=>
        {
            this.Fields.push(new HeadQuarterField(this,<Ceil>ceil,skin.GetCeil()));
        });
        this._onCellStateChanged = this.OnCeilStateChanged.bind(this);
        this._cell.CellStateChanged.on(this._onCellStateChanged);
        this.InitPosition(ceil.GetBoundingBox());

        this.GetDisplayObjects().forEach(obj => {obj.visible = this._cell.IsVisible();});
    }
    protected OnCeilStateChanged(obj:any,ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState !== CeilState.Hidden;
        });
    }

    public GetCurrentCeil(): Ceil {
        return this._cell;
    }

    private IsHqContainer(item: any):item is IHqContainer{
        return 'Hq' in item;
    }

    public IsEnemy(item: AliveItem): boolean {
        if(this.IsHqContainer(item as any))
        {
            return (<IHqContainer>(item as any)).Hq !== this;
        }
        else if(item instanceof Headquarter)
        {
            return (<Headquarter>(item as any)) !== this;
        }
        return false;
    }
    
    Support(vehicule: Vehicle): void {
    }

    IsDesctrutible(): boolean {
        return true;
    }
    GetCeil(): Ceil {
        return this._cell;
    }

    IsBlocking(): boolean {
        return true;
    }

    public GetSkin():HqSkin{
        return this._skin;
    }

    public CreateTank(pos:Ceil=null):boolean
    {
        let isCreated = false;
        this.Fields.every(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                if(field.GetCeil().IsVisible()){
                    const explosion = new Explosion(field.GetCeil().GetBoundingBox(),Archive.constructionEffects,5,false,5);
                    PlaygroundHelper.Playground.Items.push(explosion);
                }
                this.Count +=1;
                const tank = new Tank(this);
                tank.Id = `${this.PlayerName}${this.Count}`;
                tank.SetPosition(pos === null ?field.GetCeil():pos);
                PlaygroundHelper.VehiclesContainer.Add(tank);
                PlaygroundHelper.Playground.Items.push(tank);
                isCreated = true;
                this.NotifyTank(tank);
                if(this.FlagCeil){
                    tank.SetOrder(new SimpleOrder(this.FlagCeil.GetCeil(),tank));
                }
                return false;
            }
            return true;
        });

        return isCreated;
    }

    protected NotifyTank(tank: Tank) {
        PeerHandler.SendMessage(PacketKind.Create, {
            Type: "Tank",
            Id: tank.Id,
            Ceil: tank.GetCurrentCeil().GetCoordinate(),
            Hq: this._cell.GetCoordinate()
        });
    }

    protected NotifyTruck(truck: Truck) {
        PeerHandler.SendMessage(PacketKind.Create, {
            Type: "Truck",
            Id: truck.Id,
            Ceil: truck.GetCurrentCeil().GetCoordinate(),
            Hq: this._cell.GetCoordinate()
        });
    }

    public CreateTruck(pos:Ceil=null):boolean
    {
        let isCreated = false;
        this.Fields.every(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                if(field.GetCeil().IsVisible()){
                    const explosion = new Explosion(field.GetCeil().GetBoundingBox(),Archive.constructionEffects,5,false,5);
                    PlaygroundHelper.Playground.Items.push(explosion);
                }
                this.Count +=1;
                let truck = new Truck(this);
                truck.Id = `${this.PlayerName}${this.Count}`;
                truck.SetPosition(pos === null ?field.GetCeil():pos);
                PlaygroundHelper.VehiclesContainer.Add(truck);
                PlaygroundHelper.Playground.Items.push(truck);
                isCreated = true;
                this.NotifyTruck(truck);
                return false;
            }
            return true;
        });

        return isCreated;
    }



    public GetBoundingBox(): BoundingBox {
        return this._boundingBox;
    }   

    public Select(context: InteractionContext): boolean {
        return false;
        }

    public Destroy():void{
        super.Destroy();
        PlaygroundHelper.Render.Remove(this);
        this._cell.CellStateChanged.off(this._onCellStateChanged);
        this._cell.DestroyField();
        this.IsUpdatable = false;
        this.Fields.forEach(field=>{
            field.Destroy();
        });
    }

    private _tankRequestCount:number=0;
    public TankRequestEvent:LiteEvent<number> = new LiteEvent<number>();

    public GetTankRequests():number{
        return this._tankRequestCount;
    }

    public AddTankRequest():void {
        if(this._tankRequestCount < 4){
            this._tankRequestCount+=1;
            this.TankRequestEvent.trigger(this,this._tankRequestCount);
        }
    }

    public RemoveTankRequest():void {
        if(this._tankRequestCount > 0){
            this._tankRequestCount-=1;
            this.TankRequestEvent.trigger(this,this._tankRequestCount);
        }
    }

    private _truckRequestCount:number=0;
    public TruckRequestEvent:LiteEvent<number>= new LiteEvent<number>();

    public GetTruckRequests():number{
        return this._truckRequestCount;
    }

    public AddTruckRequest():void {
        if(this._truckRequestCount < 4){
            this._truckRequestCount+=1;
            this.TruckRequestEvent.trigger(this,this._truckRequestCount);
        }
    }

    public RemoveTruckRequest():void {
        if(this._truckRequestCount > 0){
            this._truckRequestCount-=1;
            this.TruckRequestEvent.trigger(this,this._truckRequestCount);
        }
    }

    public Update(viewX: number, viewY: number):void 
    {
        while(this._truckRequestCount > 0 && this._diamondCount >= GameSettings.TruckPrice)
        {
            if(this.HasMoney(GameSettings.TruckPrice))
            {
                if(this.CreateTruck()){
                    this.Buy(GameSettings.TruckPrice);
                    this.RemoveTruckRequest();
                }
                else
                {
                    //no available slots
                    break;
                }
            }
        }

        while(this._tankRequestCount > 0 && this._diamondCount >= GameSettings.TankPrice)
        {
            if(this.HasMoney(GameSettings.TankPrice))
            {
                if(this.CreateTank()){
                    this.Buy(GameSettings.TankPrice);
                    this.RemoveTankRequest();
                }
                else
                {
                    //no available slots
                    break;
                }
            }
        }

        this.GetBothSprites(Archive.building.hq.bottom).forEach(sprite=>sprite.rotation += 0.1);

        if(!this.IsAlive())
        {
            this.Destroy();
            let crater = new Crater(this._boundingBox);
            PlaygroundHelper.Playground.Items.push(crater);
            return;
        }

        super.Update(viewX,viewY);

        this.Fields.forEach(field=>{
            field.Update(viewX,viewY);
            this.Earn(field.Diamonds);
            field.Diamonds = 0;            
        });
    }

    public DiamondCountEvent:LiteEvent<number> = new LiteEvent<number>();

    public Buy(amount:number):void{
        if(this._diamondCount >= amount){
            this._diamondCount -= amount;
            this.DiamondCountEvent.trigger(this,this._diamondCount);
        }
    }

    public Earn(amount:number):void{
        this._diamondCount += amount;
        this.DiamondCountEvent.trigger(this,this._diamondCount);
    }

    protected GetAmount():number{
        return this._diamondCount;
    }

    public HasMoney(cost:number):boolean{
        if(cost <= this._diamondCount){
            return true;
        }
        if(this === PlaygroundHelper.PlayerHeadquarter){
            PlaygroundHelper.SetWarning();
        }
        return false;
    }

}