import { Item } from "./Item";
import { BlockingField } from "./Field/RockField";
import { Ceil } from "./Ceil";
import { BasicField } from "./Field/BasicField";
import { Archive } from "./Tools/ResourceArchiver";
import { WaterField } from "./Field/WaterField";

export class CeilDecorator{

    public static Decorate(items:Array<Item>, ceil:Ceil):void
    {
        var random = Math.random();
        if(random < 0.6)
        {
            var decorationRandom = Math.random();
    
            if(decorationRandom <= 0.25)
            {
                ceil.SetDecoration(Archive.nature.stone);
            }
            else if(decorationRandom <= 0.5)
            {
                ceil.SetDecoration(Archive.nature.bush);
            }
            else if(decorationRandom <= 0.75)
            {
                if(ceil.GetField() instanceof BasicField)
                {
                    if(decorationRandom <= 0.58)
                    {
                        items.push(new WaterField(ceil)); 

                    }
                    else if(decorationRandom <= 0.64)
                    {
                        items.push(new BlockingField(ceil,Archive.nature.tree)); 
                    }
                    else
                    {
                        items.push(new BlockingField(ceil,Archive.nature.rock)); 
                    }
                }
            }
            else
            {
                ceil.SetDecoration(Archive.nature.puddle);
            }

        }
    }    
}