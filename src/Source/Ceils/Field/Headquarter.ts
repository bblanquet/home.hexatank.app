import { BoundingBox } from "../../BoundingBox";
import { InteractionContext } from "../../Context/InteractionContext";
import { PlaygroundHelper } from "../../PlaygroundHelper";
import { Ceil } from "../Ceil";
import { HeadQuarterField } from "./HeadquarterField"; 
import { Tank } from "../../Unit/Tank";
import { HqSkin } from "../../HqSkin";
import { AliveItem } from "../../AliveItem";
import { IHqContainer } from "../../IHqContainer";
import { IField } from "./IField"; 
import { Vehicle } from "../../Unit/Vehicle";
import { Crater } from "../../Crater";
import { ISelectable } from "../../ISelectable";
import { Archive } from "../../Tools/ResourceArchiver";
import { CeilState } from "../CeilState";
import { Explosion } from "../../Unit/Explosion";
import { Truck } from "../../Unit/Truck";

export class Headquarter extends AliveItem implements IField, ISelectable
{
    private _boundingBox:BoundingBox;
    private _ceil:Ceil; 
    protected Fields:Array<HeadQuarterField>;
    Diamonds:number=PlaygroundHelper.Settings.PocketMoney;
    private _skin:HqSkin;
    private _onCeilStateChanged:{(ceilState:CeilState):void};



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
    private _visibleHandlers: { (data: ISelectable):void }[] = [];

    public SubscribeUnselection(handler: (data: ISelectable) => void): void {
        this._visibleHandlers.push(handler);
    }
    public Unsubscribe(handler: (data: ISelectable) => void): void {
        this._visibleHandlers = this._visibleHandlers.filter(h => h !== handler);
    }

    public IsSelected():boolean{
        return this.GetCurrentSprites()[Archive.selectionUnit].alpha === 1;
    }

    public SetSelected(visible:boolean):void{
        this.GetCurrentSprites()[Archive.selectionUnit].alpha = visible ? 1 : 0;
        if(!visible){
            this._visibleHandlers.forEach(h=>h(this));
        }
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

    public CreateTank():boolean
    {
        let isCreated = false;
        this.Fields.every(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                if(field.GetCeil().IsVisible()){
                    const explosion = new Explosion(field.GetCeil().GetBoundingBox(),Archive.constructionEffects,6,false,5);
                    PlaygroundHelper.Playground.Items.push(explosion);
                }
                const tank = new Tank(this);
                tank.SetPosition(field.GetCeil());
                PlaygroundHelper.Playground.Items.push(tank);
                isCreated = true;
                return false;
            }
            return true;
        });

        return isCreated;
    }

    public CreateTruck():boolean
    {
        let isCreated = false;
        this.Fields.every(field=>
        {
            if(!field.GetCeil().IsBlocked())
            {
                if(field.GetCeil().IsVisible()){
                    const explosion = new Explosion(field.GetCeil().GetBoundingBox(),Archive.constructionEffects,6,false,5);
                    PlaygroundHelper.Playground.Items.push(explosion);
                }
                var truck = new Truck(this);
                truck.SetPosition(field.GetCeil());
                PlaygroundHelper.Playground.Items.push(truck);
                isCreated = true;
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

    public Update(viewX: number, viewY: number):void 
    {
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