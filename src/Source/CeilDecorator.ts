import { Item } from "./Item";
import { RockField } from "./Field/RockField";
import { Ceil } from "./Ceil";
import { PlaygroundHelper } from "./PlaygroundHelper";
import { isNullOrUndefined } from "util";
import { BasicField } from "./Field/BasicField";

export class CeilDecorator{

    public static Decorate(items:Array<Item>, ceil:Ceil):void
    {
        var random = Math.random();
        if(random < 0.6)
        {
            var decorationRandom = Math.random();
    
            if(decorationRandom <= 0.25)
            {
                ceil.SetDecoration(PlaygroundHelper.SpriteProvider.GetSprite("stone.png"));
            }
            else if(decorationRandom <= 0.5)
            {
                ceil.SetDecoration(PlaygroundHelper.SpriteProvider.GetSprite("flower.png"));
            }
            else if(decorationRandom <= 0.75)
            {
                if(ceil.GetField() instanceof BasicField)
                {
                    var deco = './nature/rock.svg';
                    if(decorationRandom <= 0.625)
                    {
                        deco = './nature/tree.svg';
                    }
    
                    items.push(new RockField(ceil,deco)); 
                }
            }
            else
            {
                ceil.SetDecoration(PlaygroundHelper.SpriteProvider.GetSprite("water.png"));
            }

        }
    }    
}