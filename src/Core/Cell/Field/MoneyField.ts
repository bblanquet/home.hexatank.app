import { Cell } from "../Cell";
import { InteractionContext } from "../../Context/InteractionContext";
import { Archive } from "../../Utils/ResourceArchiver";
import { Timer } from "../../Utils/Timer"; 
import { Light } from "../../Items/Others/Light";
import { Field } from "./Field";
import { BoundingBox } from "../../Utils/BoundingBox";
import { Vehicle } from "../../Items/Unit/Vehicle";
import { Truck } from "../../Items/Unit/Truck";
import { CellState } from "../CellState";
import { GameSettings } from "../../Utils/GameSettings"; 

export class MoneyField extends Field
{ 
    private _timer:Timer;
    private _light:Light;

    constructor(cell:Cell){
        super(cell);
        this.GetCell().SetField(this);
        this.Z= 1; 
        this._timer = new Timer(10);
        this._light = new Light(cell.GetBoundingBox());
        this._light.Hide();
        this.GenerateSprite(Archive.bonus.emptyMoney);
        this.GenerateSprite(Archive.bonus.fullMoney,s=>s.alpha=0);      
        this.InitPosition(cell.GetBoundingBox());
        this.GetDisplayObjects().forEach(obj => {obj.visible = this.GetCell().IsVisible();});
    }

    protected OnCellStateChanged(cellState: CellState): void {
        this.GetDisplayObjects().forEach(s=>{
            s.visible = cellState !== CellState.Hidden;
        });
    }

    private IsFull():boolean{
        return this.GetCurrentSprites()[Archive.bonus.fullMoney].alpha >= 1;
    }

    private SetEmpty():void{
        this.SetProperty(Archive.bonus.fullMoney, s=>s.alpha = 0);
    }

    public GetBoundingBox(): BoundingBox {
        return this.GetCell().GetBoundingBox();
    }
    public Select(context: InteractionContext): boolean {
        return false;
    }
    Support(vehicule: Vehicle): void {
        if(this.IsFull())
        {
            if(vehicule instanceof Truck){
                let truck = vehicule as Truck;
                const sum = this.GetInfluenceSum(vehicule);
                truck.Hq.Earn(1+sum);
                this.SetEmpty();
                this._light.Hide();
            }
        }

        vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
        vehicule.RotationSpeed = GameSettings.RotationSpeed;
        vehicule.Attack = GameSettings.Attack;
    }    

    IsDesctrutible(): boolean {
        return false;
    }

    IsBlocking(): boolean {
        return false;
    }

    public Update(viewX: number, viewY: number): void 
    {
        super.Update(viewX,viewY);

        if(this.IsFull()){
            this._light.Update(viewX,viewY);
        }

        if(!this.IsFull())
        {
            if(this._timer.IsElapsed())
            {
                this.SetProperty(Archive.bonus.fullMoney,s=>s.alpha += 0.02);
                if(this.GetCurrentSprites()[Archive.bonus.fullMoney].alpha >= 1)
                {
                    this._light.Display();
                }
            }
        }

    }

}