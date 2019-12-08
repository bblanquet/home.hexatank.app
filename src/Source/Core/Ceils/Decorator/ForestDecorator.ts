import { DecoratingElement } from './DecoratingElement';
import { DecorationType } from "../../Setup/Generator/DecorationType";
import { Decorator } from './Decorator';

export class ForestDecorator extends Decorator{

    constructor(){
        super();
        this._blockingCells = [
            new DecoratingElement(DecorationType.Rock),
            new DecoratingElement(DecorationType.Tree),
            new DecoratingElement(DecorationType.Water),
            new DecoratingElement(DecorationType.Volcano,1)
        ];

        this._decorationCells = [
            new DecoratingElement(DecorationType.Stone),
            new DecoratingElement(DecorationType.Bush),
            new DecoratingElement(DecorationType.Puddle),
        ]
    }
}