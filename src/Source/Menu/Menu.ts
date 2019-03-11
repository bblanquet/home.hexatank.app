import { MenuItem } from "./MenuItem";
import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../Context/InteractionContext";

export abstract class Menu extends Item{
    Items:Array<MenuItem>;
    protected IsHidden:boolean=false;

    public Update(viewX: number, viewY: number): void {
        this.Items.forEach(item=>{ 
            item.Update(viewX,viewY);
        });
    }

    public GetBoundingBox(): BoundingBox {
        throw new Error("Method not implemented.");
    }
 
    public Select(context: InteractionContext): boolean {
        //console.log(`%c cont x: ${context.Point.x} y: ${context.Point.y} `,'color:green;font-weight:bold;');
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