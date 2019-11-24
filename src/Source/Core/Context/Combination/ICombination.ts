import { CombinationContext } from './CombinationContext';

export interface ICombination{
    IsMatching(context:CombinationContext):boolean;
    Combine(context:CombinationContext):boolean;
    Clear():void;
} 