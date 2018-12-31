import { MenuItem } from "./MenuItem";
import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../InteractionContext";

export abstract class Menu extends Item{
    Items:Array<MenuItem>;

    public Update(viewX: number, viewY: number, zoom: number): void {
        this.Items.forEach(item=>{
            item.Update(viewX,viewY,zoom);
        });
    }

    public GetBoundingBox(): BoundingBox {
        throw new Error("Method not implemented.");
    }

    public Select(context: InteractionContext): boolean {
        //console.log(`%c cont x: ${context.Point.x} y: ${context.Point.y} `,'color:green;font-weight:bold;');
        let isSelected = false;
        this.Items.every(element => {
            if(element.GetSprites()[0].containsPoint(context.Point))
            {
                isSelected = element.Select(context);
                console.log(`selected: ${isSelected}`,'font-weight:bold;color:red;');
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