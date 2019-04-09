import { Item } from "./Item";
import { RockField } from "./Field/RockField";
import { Ceil } from "./Ceil";
import { BasicField } from "./Field/BasicField";
import { Archive } from "./Tools/ResourceArchiver";

export class CeilDecorator{

    public static Decorate(items:Array<Item>, ceil:Ceil):void
    {
        var random = Math.random();
        if(random < 0.6)
        {
            var decorationRandom = Math.random();
    
            if(decorationRandom <= 0.25)
            {
                ceil.SetDecoration('stone.png');
            }
            else if(decorationRandom <= 0.5)
            {
                ceil.SetDecoration('flower.png');
            }
            else if(decorationRandom <= 0.75)
            {
                if(ceil.GetField() instanceof BasicField)
                {
                    var deco = Archive.nature.rock;
                    if(decorationRandom <= 0.625)
                    {
                        deco = Archive.nature.tree;
                    }
    
                    items.push(new RockField(ceil,deco)); 
                }
            }
            else
            {
                ceil.SetDecoration('water.png');
            }

        }
    }    
}