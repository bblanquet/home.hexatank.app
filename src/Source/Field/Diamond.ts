import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";
import { Light } from "../Light";
import { Ceil } from "../Ceil";
import { DiamondField } from "./DiamondField";
import { Vehicle } from "../Unit/Vehicle";
import { AliveItem } from "../AliveItem"; 
import { Crater } from "../Crater";
import { Archive } from "../Tools/ResourceArchiver";
import { AliveField } from "./AliveField";
import { CeilState } from "../CeilState";

export class Diamond extends AliveField{

    BoundingBox:BoundingBox;
    Lights:Light;
    Fields:Array<DiamondField>;

    constructor(ceil:Ceil) 
    {
        super(ceil);
        this.Z= 1;
        this.GetCeil().SetField(this);
        this.BoundingBox = this.GetCeil().GetBoundingBox();
        this.GenerateSprite(Archive.nature.diamond);

        this.Lights = new Light(this.GetBoundingBox());
        this.Lights.Display();
        this.Fields = new Array<DiamondField>();
        var neighbours = this.GetCeil().GetNeighbourhood();
        neighbours.forEach(ceil=>
        {
            this.Fields.push(new DiamondField(<Ceil>ceil));
        });
        this.InitPosition(ceil.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
        this.Lights.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCeil().IsVisible();});
    }


    protected OnCeilStateChanged(ceilState: CeilState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible || ceilState === CeilState.HalfVisible;
        });
        this.Lights.GetDisplayObjects().forEach(s=>{
            s.visible = ceilState === CeilState.Visible || ceilState === CeilState.HalfVisible;
        });
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
        this.GetCeil().DestroyField();
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