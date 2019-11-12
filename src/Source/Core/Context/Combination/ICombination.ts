import { CombinationContext } from './CombinationContext';

export interface ICombination{
    IsMatching(items:CombinationContext):boolean;
    Combine(items:CombinationContext):boolean;
    Clear():void;
} 