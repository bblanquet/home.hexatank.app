import { Item } from "../Items/Item";
import { BlockingField } from "./Field/RockField";
import { Ceil } from "./Ceil"; 
import { Archive } from "../Utils/ResourceArchiver";
import { WaterField } from "./Field/WaterField"; 
import { DecorationType } from "../Setup/Generator/DecorationType";

export class CeilDecorator{

    public static Decorate():DecorationType
    {
        let result = DecorationType.None;
        var random = Math.random();
        if(random < 0.6)
        {
            var decorationRandom = Math.random();
    
            if(decorationRandom <= 0.25)
            {
                result = DecorationType.Stone;
            }
            else if(decorationRandom <= 0.5)
            {
                result = DecorationType.Bush;
            }
            else if(decorationRandom <= 0.75)
            {
                if(decorationRandom <= 0.58)
                {
                    result = DecorationType.Water;

                }
                else if(decorationRandom <= 0.64)
                {
                    result = DecorationType.Tree;
                }
                else
                {
                    result = DecorationType.Rock;
                }
            }
            else
            {
                result = DecorationType.Puddle;
            }
        }
        return result;
    }    

    public static SetDecoration(items:Array<Item>, ceil:Ceil, type:DecorationType):void
    {
        switch(type){
            case DecorationType.Stone: { 
                ceil.SetDecoration(Archive.nature.stone);
                break; 
             }
             case DecorationType.Bush: { 
                ceil.SetDecoration(Archive.nature.bush);
                break; 
             }  
             case DecorationType.Water: { 
                items.push(new WaterField(ceil)); 
                break; 
             }  
             case DecorationType.Tree: { 
                items.push(new BlockingField(ceil,Archive.nature.tree)); 
                break; 
             }
             case DecorationType.Rock: { 
                items.push(new BlockingField(ceil,Archive.nature.rock)); 
                break; 
             }    
             case DecorationType.Puddle: { 
                ceil.SetDecoration(Archive.nature.puddle);
                break; 
             }    
        }
    }    
}