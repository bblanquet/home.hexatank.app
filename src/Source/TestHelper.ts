import {CeilsContainer} from './CeilsContainer';
import {AStarEngine} from './AStarEngine';
import {CeilProperties} from './CeilProperties';

export class TestHelper{
    static CeilsContainer:CeilsContainer<CeilProperties>;
    static Engine:AStarEngine<CeilProperties>;        

    static Init():void{
        TestHelper.CeilsContainer = new CeilsContainer<CeilProperties>();
        TestHelper.Engine = new AStarEngine<CeilProperties>();
    }
}