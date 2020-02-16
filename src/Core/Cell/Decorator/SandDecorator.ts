import { DecorationType } from '../../Setup/Generator/DecorationType';
import { DecoratingElement } from './DecoratingElement';
import { Decorator } from './Decorator';
export class SandDecorator extends Decorator{
    constructor(){
        super();
        this._blockingCells = [
            new DecoratingElement(DecorationType.SandRock),
            new DecoratingElement(DecorationType.palmTree),
            new DecoratingElement(DecorationType.Water),
        ];

        this._decorationCells = [
            new DecoratingElement(DecorationType.Stone),
            new DecoratingElement(DecorationType.SandStone),
            new DecoratingElement(DecorationType.Bush),
        ]
    }
}