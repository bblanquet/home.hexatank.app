import { MenuItem } from "./MenuItem";
import { Item } from "../Items/Item";
import { BoundingBox } from "../Utils/BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";
import { ISelectable } from "../ISelectable";
 
export abstract class Menu extends Item{
    Items:Array<MenuItem>;
    protected IsHidden:boolean=false;
    private _hide:{(data: ISelectable):void};

    constructor(){
        super();
        this._hide = this.Hide.bind(this);
    }

    public Update(viewX: number, viewY: number): void {
        this.Items.forEach(item=>{ 
            item.Update(viewX,viewY);
        });
    }

    public GetBoundingBox(): BoundingBox {
        throw new Error("Method not implemented.");
    }
 
    public Show(data: ISelectable):void{
        data.SubscribeUnselection(this._hide);
    }

    public Destroy():void{
        super.Destroy();
        this.Items.forEach(item=>{
            item.Destroy();
        })
    }

    protected Hide(data: ISelectable):void{
        data.Unsubscribe(this._hide);
    }

    public Select(context: InteractionContext): boolean {
        if(this.IsHidden){
            return;
        }
        
        let isSelected = false;
        this.Items.every(element => {
            if(element.GetSprites()[0].containsPoint(context.Point))
            {
                isSelected = element.Select(context);
                if(isSelected)
                {
                    return false;
                }
            }
            return true;
        });
        return isSelected;
    }
}