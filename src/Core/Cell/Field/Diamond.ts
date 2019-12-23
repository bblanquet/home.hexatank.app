import { InteractionContext } from "../../Context/InteractionContext";
import { Light } from "../../Items/Others/Light";
import { Cell } from "../Cell"; 
import { DiamondField } from "./DiamondField";
import { AliveItem } from "../../Items/AliveItem";  
import { Crater } from "../../Items/Others/Crater";
import { Archive } from "../../Utils/ResourceArchiver";
import { AliveField } from "./AliveField";  
import { CellState } from "../CellState";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";

export class Diamond extends AliveField{

    BoundingBox:BoundingBox;
    Lights:Light;
    Fields:Array<DiamondField>;

    constructor(cell:Cell) 
    {
        super(cell);
        this.TotalLife = 150;
        this.Life = 150;
        this.Z= 1;
        this.GetCell().SetField(this);
        this.BoundingBox = this.GetCell().GetBoundingBox();
        this.GenerateSprite(Archive.nature.diamond);

        this.Lights = new Light(this.GetBoundingBox());
        this.Lights.Display();
        this.Fields = new Array<DiamondField>();
        var neighbours = this.GetCell().GetNeighbourhood();
        neighbours.forEach(cell=>
        {
            const field = new DiamondField(<Cell>cell);
            this.Fields.push(field);
            field.Loaded.on(this.OnLoaded.bind(this));
        });
        this.InitPosition(cell.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
        this.Lights.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
    }

    protected OnCellStateChanged(cellState: CellState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = cellState !== CellState.Hidden;
        });
        this.Lights.GetDisplayObjects().forEach(s=>{
            s.visible = cellState !== CellState.Hidden;
        });
    }

    private OnLoaded(obj:any,e:{}):void{
        this.SetDamage(1);
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
        this.GetCell().DestroyField();
        this.IsUpdatable = false;
        this.Fields.forEach(field=>{
            field.Loaded.clear();
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