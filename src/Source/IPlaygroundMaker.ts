import {ICeil} from './ICeil';

export interface IPlaygroundBuilder<T extends ICeil>{
    Build() :Array<T>;
}