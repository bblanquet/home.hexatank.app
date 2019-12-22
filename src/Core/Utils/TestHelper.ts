import {CeilsContainer} from '../Ceils/CeilsContainer';
import {AStarEngine} from '../Ia/AStarEngine';
import { CeilProperties } from '../Ceils/CeilProperties'; 

export class TestHelper{
    static CeilsContainer:CeilsContainer<CeilProperties>;
    static Engine:AStarEngine<CeilProperties>;        

    static Init():void{
        TestHelper.CeilsContainer = new CeilsContainer<CeilProperties>();
        TestHelper.Engine = new AStarEngine<CeilProperties>();
    }
}