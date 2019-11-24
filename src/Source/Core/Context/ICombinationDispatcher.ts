import { CombinationContext } from './Combination/CombinationContext';

export interface ICombinationDispatcher{
    Check(items:CombinationContext):void;
} 