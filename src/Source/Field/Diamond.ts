import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Light } from "../Light";
import { Ceil } from "../Ceil";
import { DiamondField } from "./DiamondField";
import { IField } from "./IField";
import { Vehicle } from "../Unit/Vehicle";
import { AliveItem } from "../AliveItem"; 
import { Crater } from "../Crater";
import { Archive } from "../Tools/ResourceArchiver";

export class Diamond extends AliveItem implements IField{

    BoundingBox:BoundingBox;
    Lights:Light;
    Fields:Array<DiamondField>;
    private _ceil:Ceil;//4

    constructor(ceil:Ceil) 
    {
        super();
        this.Z= 1;
        this._ceil = ceil;
        this._ceil.SetField(this);
        this.BoundingBox = this._ceil.GetBoundingBox();
        this.GenerateSprite(Archive.nature.diamond);

        this.Lights = new Light(this.GetBoundingBox());
        this.Lights.Display();
        this.Fields = new Array<DiamondField>();
        var neighbours = this._ceil.GetNeighbourhood();
        neighbours.forEach(ceil=>
        {
            this.Fields.push(new DiamondField(<Ceil>ceil));
        });
        this.InitPosition(ceil.GetBoundingBox());
    }
    public GetCurrentCeil(): Ceil {
        return this._ceil;
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
    
    public Destroy():void{
        super.Destroy();
        PlaygroundHelper.Render.Remove(this);
        this._ceil.DestroyField();
        this.IsUpdatable = false;
        this.Fields.forEach(field=>{
            field.Destroy();
        });
        this.Lights.Destroy();
    }

    public Update(viewX: number, viewY: number): void {
        if(!this.IsAlive())
        {
            this.Destroy();
            let crater = new Crater(this.BoundingBox);
            PlaygroundHelper.Playground.Items.push(crater);
            return;
        }

        super.Update(viewX,viewY);
        this.Fields.forEach(field=>{
            field.Update(viewX,viewY);
        });

        this.Lights.Update(viewX,viewY);
    }

     public Select(context: InteractionContext): boolean {
        return false;
    }
}