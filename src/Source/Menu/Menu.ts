import { MenuItem } from "./MenuItem";
import { Item } from "../Item";
import { BoundingBox } from "../BoundingBox";
import { InteractionContext } from "../InteractionContext";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class Menu extends Item{
    Items:Array<MenuItem>;

    constructor(items:Array<MenuItem>){
        super();

        let size = 100;
        let margin = PlaygroundHelper.Settings.ScreenHeight/2 - items.length * size /2; 
        let x = PlaygroundHelper.Settings.ScreenWidth - size;
        let i = 0;
        this.Items = new Array<MenuItem>();
        items.forEach(item=>
            {
                item.SetBoundingBox({x:x, y:margin+i*size, width:size, height:size})
                this.Items.push(item);
                i += 1;
            }
        );
    }

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
                if(isSelected)
                {
                    return false;
                }
            }
        });
        return isSelected;
    }
}