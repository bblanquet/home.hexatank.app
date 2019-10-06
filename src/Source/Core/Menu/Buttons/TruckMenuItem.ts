import { InteractionContext } from "../../Context/InteractionContext";
import { Archive } from "../../Utils/ResourceArchiver";
import { SelectableMenuItem } from "../SelectableMenuItem";
import { PlaygroundHelper } from "../../Utils/PlaygroundHelper";

export class TruckMenuItem extends SelectableMenuItem 
{
    private _requests:Array<string>;
    private _refresh:{(c:number):void};
    constructor(){
        super(Archive.menu.truckButton);
        this._requests =Archive.menu.amounts;
        this.Z = 6;
        this._requests.forEach(r=>{ 
            this.GenerateSprite(r,s=>s.alpha =0);
        });
        this.SetProperties([Archive.menu.amounts[0]],s=>s.alpha=1);
        PlaygroundHelper.Render.Add(this);
        this._refresh = this.RefreshAmount;
        PlaygroundHelper.PlayerHeadquarter.SubscribeTruck(this._refresh.bind(this));
    }

    private RefreshAmount(c:number):void{
        this._requests.forEach(r=>this.SetProperty(r,s=>s.alpha=0));
        this.SetProperty(this._requests[c],s=>s.alpha=1);
    }

    public Destroy():void{
        super.Destroy();
        PlaygroundHelper.PlayerHeadquarter.UnSubscribeTruck(this._refresh);
    }

    public Show(): void {
    }

    public Select(context: InteractionContext): boolean      
    {      
        context.OnSelect(this); 
        super.Select(context);
        return true;
    }

}