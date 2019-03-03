import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Light } from "../Light";
import { Ceil } from "../Ceil";
import { DiamondField } from "./DiamondField";
import { IField } from "./IField";
import { Vehicle } from "../Vehicle";
import { Timer } from "../Tools/Timer";
import { AliveItem } from "../AliveItem";
import { Crater } from "../Crater";

export class Diamond extends AliveItem implements IField{

    BoundingBox:BoundingBox;
    Lights:Array<Light>;
    Fields:Array<DiamondField>;
    private _ceil:Ceil;//4
    private _timer:Timer;

    constructor(ceil:Ceil) 
    {
        super();
        this.Z= 1;
        this._ceil = ceil;
        this._ceil.SetField(this);
        this.BoundingBox = this._ceil.GetBoundingBox();
        var sprite = PlaygroundHelper.SpriteProvider.GetSprite("diamond.png");
        this.DisplayObjects.push(sprite);
        this._timer = new Timer(4);

        this.Lights = new Array<Light>();
        this.Lights.push(new Light());
        this.Lights.push(new Light());
        this.Lights.push(new Light());

        this.Fields = new Array<DiamondField>();
        var neighbours = this._ceil.GetNeighbourhood();
        neighbours.forEach(ceil=>
        {
            this.Fields.push(new DiamondField(<Ceil>ceil));
        });
        PlaygroundHelper.Render.Add(this);
    }

    GetCeil(): Ceil {
        return this._ceil;
    }

    Support(vehicule:Vehicle): void {
    }
    
    IsDesctrutible(): boolean {
        return true;
    }

    public IsEnemy(item: AliveItem): boolean {
        return true;
    }

    IsBlocking(): boolean {
        return true;
    }

    public GetBoundingBox(): BoundingBox{
        return this.BoundingBox;
    }
    
    protected Destroy():void{
        PlaygroundHelper.Render.Remove(this);
        this._ceil.DestroyField();
        this.IsUpdatable = false;
        this.Fields.forEach(field=>{
            field.Destroy();
        });
    }

    public Update(viewX: number, viewY: number, zoom: number): void {
        if(!this.IsAlive())
        {
            this.Destroy();
            let crater = new Crater(this.BoundingBox);
            PlaygroundHelper.Playground.Items.push(crater);
            return;
        }

        super.Update(viewX,viewY,zoom);
        this.Fields.forEach(field=>{
            field.Update(viewX,viewY,zoom);
        });

        
        if(this._timer.IsElapsed())
        {
            this.Lights.forEach(light=>{
                if(!light.IsShowing)
                {
                    
                    var randomX = Math.random();
                    var randomY = Math.random();
                    var randomXsign = Math.random();
                    var randomYsign = Math.random();
                    var quarter = PlaygroundHelper.Settings.Size/4;
    
                    if(randomXsign < 0.5)
                    {
                        randomX = -quarter * randomX;
                    }
                    else
                    {
                        randomX = quarter * randomX;
                    }
    
                    if(randomYsign < 0.5)
                    {
                        randomY = -quarter * randomY;
                    }
                    else
                    {
                        randomY = quarter * randomY;
                    }
    
                    light.Display(
                        this._ceil.GetBoundingBox().GetCenter() + randomX, 
                        this._ceil.GetBoundingBox().GetMiddle() + randomY);
                }
            });
        }

        this.Lights.forEach(light=>
        {
            if(light.IsShowing)
            {
                light.Update(viewX,viewY,zoom);
            }
        });
    }

     public Select(context: InteractionContext): boolean {
        return false;
    }
}