import {Ceil} from "./Ceil";
import * as PIXI from 'pixi.js';
import { Item } from "./Item";
import { RockField } from "./RockField";

export class CeilDecorator{

    public static Decorate(items:Array<Item>, ceil:Ceil, textures : PIXI.loaders.TextureDictionary):void
    {
        ceil.Decorate(textures);

        var random = Math.random();
        if(random < 0.6)
        {
            var decorationRandom = Math.random();
    
            if(decorationRandom <= 0.25)
            {
                ceil.DisplayObjects.push(new PIXI.Sprite(textures["stone.png"]));
            }
            else if(decorationRandom <= 0.5)
            {
                ceil.DisplayObjects.push(new PIXI.Sprite(textures["flower.png"]));
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
                ceil.DisplayObjects.push(new PIXI.Sprite(textures["water.png"]));
            }

        }
    }    
}


            //var rotationRandom = Math.random();
            //this.decoratonSprite.x = this.x;
            //this.decoratonSprite.y = this.y;
            //this.decoratonSprite.width = 50;
            //this.decoratonSprite.height = 50;
            //this.decoratonSprite.pivot.set(this.GetCenter(),this.GetMiddle());
            //this.decoratonSprite.rotation = rotationRandom * 360;
            //this.decorationX = this.decoratonSprite.x;
            //this.decorationY = this.decoratonSprite.y;