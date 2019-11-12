import { CombinationContext } from './Combination/CombinationContext';

export interface IListenersContainer{
    Check(items:CombinationContext):void;
} 