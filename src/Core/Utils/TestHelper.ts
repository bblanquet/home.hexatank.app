import {CellContainer} from '../Cell/CellContainer';
import {AStarEngine} from '../Ia/AStarEngine'; 
import { CellProperties } from '../Cell/CellProperties'; 

export class TestHelper{
    static CellContainer:CellContainer<CellProperties>;
    static Engine:AStarEngine<CellProperties>;        

    static Init():void{
        this.CellContainer = new CellContainer<CellProperties>();
        this.Engine = new AStarEngine<CellProperties>();
    }
}