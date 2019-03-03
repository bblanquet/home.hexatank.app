import { Item } from "./Item";
import { RockField } from "./Field/RockField";
import { Ceil } from "./Ceil";
import { PlaygroundHelper } from "./PlaygroundHelper";


export class CeilDecorator{

    public static Decorate(items:Array<Item>, ceil:Ceil):void
    {
        ceil.SetSprite();

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
                var deco = 'rock';
                if(decorationRandom <= 0.625)
                {
                    deco = 'tree';
                }

                items.push(new RockField(ceil,deco)); 
            }
            else
            {
                ceil.SetDecoration(PlaygroundHelper.SpriteProvider.GetSprite("water.png"));
            }

        }
    }    
}