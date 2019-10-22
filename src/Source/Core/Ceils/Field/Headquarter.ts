import { FlagCeil } from './../FlagCeil';
import { Tank } from './../../Items/Unit/Tank';
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

export class Headquarter extends AliveItem implements IField
{
    private _boundingBox:BoundingBox;
    private _ceil:Ceil; 
    public PlayerName:string;
    public Count:number=0;
    protected Fields:Array<HeadQuarterField>;
    public Diamonds:number=PlaygroundHelper.Settings.PocketMoney;
    private _skin:HqSkin;
    private _onCeilStateChanged:{(ceilState:CeilState):void};
    public FlagCeil:FlagCeil;

    constructor(skin:HqSkin, ceil:Ceil){
        super();
        this._skin = skin;
        this.Z= 2;
        this._ceil = ceil;
        this._ceil.SetField(this);

        this.GenerateSprite(Archive.selectionUnit);
        this.SetProperty(Archive.selectionUnit,(e)=>e.alpha=0);

        this._boundingBox = new BoundingBox();
        this._boundingBox.Width = this._ceil.GetBoundingBox().Width;
        this._boundingBox.Height = this._ceil.GetBoundingBox().Height;
        this._boundingBox.X = this._ceil.GetBoundingBox().X;
        this._boundingBox.Y = this._ceil.GetBoundingBox().Y;

        this.GenerateSprite(this.GetSkin().GetHq());
        this.GenerateSprite(Archive.building.hq.bottom);
        this.GenerateSprite(Archive.building.hq.top);

        this.GetSprites().forEach(obj => {
            obj.width = this._boundingBox.Width;
            obj.height = this._boundingBox.Height;
            obj.anchor.set(0.5);
        });
        this.IsCentralRef = true;

        var neighbours = this._ceil.GetNeighbourhood();
        this.Fields = new Array<HeadQuarterField>();
        neighbours.forEach(ceil=>
        {
            this.Fields.push(new HeadQuarterField(this,<Ceil>ceil,skin.GetCeil()));
        });
        this._onCeilStateChanged = this.OnCeilStateChanged.bind(this);
        this._ceil.RegisterCeilState(this._onCeilStateChanged);
        this.InitPosition(ceil.GetBoundingBox());

        this.GetDisplayObjects().forEach(obj => {obj.visible = this._ceil.IsVisible();});
    }
    protected OnCeilStateChanged(ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible;
        });
    }

    public GetCurrentCeil(): Ceil {
        return this._ceil;
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
        return this._ceil;
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
            Hq: this._ceil.GetCoordinate()
        });
    }

    protected NotifyTruck(truck: Truck) {
        PeerHandler.SendMessage(PacketKind.Create, {
            Type: "Truck",
            Id: truck.Id,
            Ceil: truck.GetCurrentCeil().GetCoordinate(),
            Hq: this._ceil.GetCoordinate()
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
        this._ceil.UnregisterCeilState(this._onCeilStateChanged);
        this._ceil.DestroyField();
        this.IsUpdatable = false;
        this.Fields.forEach(field=>{
            field.Destroy();
        });
    }

    private _tankRequests:number=0;
    private _tankRequestHandlers:{(message:number):void}[] = new Array<{(message:number):void}>();
    public SubscribeTank(func:{(message:number):void}):void{
        this._tankRequestHandlers.push(func);
    }
    public UnSubscribeTank(func:{(message:number):void}):void{
        this._tankRequestHandlers = this._tankRequestHandlers.filter(f=> f!==func);
    }
    public GetTankRequests():number{
        return this._tankRequests;
    }

    public AddTankRequest():void {
        if(this._tankRequests < 4){
            this._tankRequests+=1;
            this._tankRequestHandlers.forEach(t=>t(this._tankRequests));
        }
    }

    public RemoveTankRequest():void {
        if(this._tankRequests > 0){
            this._tankRequests-=1;
            this._tankRequestHandlers.forEach(t=>t(this._tankRequests));
        }
    }

    private _truckRequests:number=0;
    private _truckRequestHandlers:{(message:number):void}[] = new Array<{(message:number):void}>();
    public SubscribeTruck(func:{(message:number):void}):void{
        this._truckRequestHandlers.push(func);
    }
    public UnSubscribeTruck(func:{(message:number):void}):void{
        this._truckRequestHandlers = this._truckRequestHandlers.filter(f=> f!==func);
    }
    public GetTruckRequests():number{
        return this._truckRequests;
    }

    public AddTruckRequest():void {
        if(this._truckRequests < 4){
            this._truckRequests+=1;
            this._truckRequestHandlers.forEach(t=>t(this._truckRequests));
        }
    }

    public RemoveTruckRequest():void {
        if(this._truckRequests > 0){
            this._truckRequests-=1;
            this._truckRequestHandlers.forEach(t=>t(this._truckRequests));
        }
    }

    public Update(viewX: number, viewY: number):void 
    {
        while(
            this.Diamonds >= PlaygroundHelper.Settings.TruckPrice
            && this._truckRequests > 0)
        {
            if(this.Diamonds >= PlaygroundHelper.Settings.TruckPrice)
            {
                if(this.CreateTruck()){
                    this.Diamonds -= PlaygroundHelper.Settings.TruckPrice;
                    this.RemoveTruckRequest();
                }
                else
                {
                    //no available slots
                    break;
                }
            }
        }

        while(
            this.Diamonds >= PlaygroundHelper.Settings.TankPrice
            && this._tankRequests > 0)
        {
            if(this.Diamonds >= PlaygroundHelper.Settings.TankPrice)
            {
                if(this.CreateTank()){
                    this.Diamonds -= PlaygroundHelper.Settings.TankPrice;
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
            this.Diamonds += field.Diamonds;
            field.Diamonds = 0;            
        });
    }
}