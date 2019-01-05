import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { PlaygroundHelper } from "../PlaygroundHelper";

export class RightMenu extends Menu{
    constructor(items:Array<MenuItem>){
        super();
        this.IsHidden = false;
        let width = 50;
        let height = 75;
        let margin = PlaygroundHelper.Settings.ScreenHeight/2 - items.length * height /2; 
        let x = PlaygroundHelper.Settings.ScreenWidth - width;
        let i = 0;
        this.Items = new Array<MenuItem>(); 
        items.forEach(item=>
            {
                item.SetBoundingBox({x:x, y:margin+i*height, width:width, height:height})
                this.Items.push(item);
                i += 1;
            }
        );
    }
}