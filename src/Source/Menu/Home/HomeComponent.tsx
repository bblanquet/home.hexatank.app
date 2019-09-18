import {h, Component} from 'preact';
import {route} from 'preact-router';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { GameSetup } from '../../Core/GameSetup';

export default class HomeComponent extends Component<any, any> {

    constructor(){
        PlaygroundHelper.InitApp();
        super();
    }

    private ToCanvas(e:any):void{
        PlaygroundHelper.MapContext = new MapGenerator().GetMapDefinition(3);
        PlaygroundHelper.SetDefaultName();
        PlaygroundHelper.MapContext.Hqs[0].PlayerName = PlaygroundHelper.PlayerName;
        PlaygroundHelper.MapContext.Hqs.forEach(hq => {
            if (!hq.PlayerName) {
                hq.isIa = true;
            }
        });
        
        route('/Canvas', true);
    }

    private ToHost(e:any):void{
        route('/OffHost', true);
    }

    private ToJoin(e:any):void{
        route('/OffJoin', true);
    }

    componentDidMount() {
    }

    componentWillUnmount() {}

    render() {
        return (
            <div class="centered">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active" aria-current="page">Program 6</li>
                    </ol>
                </nav>
                <div class="btn-group-vertical">
                    <button type="button" class="btn btn-secondary" onClick={this.ToCanvas}>Single player</button>
                    <div class="btn-group" role="group">
                        <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Multiplayers
                        </button>
                        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                            <a class="dropdown-item" onClick={this.ToHost}>Host</a>
                            <a class="dropdown-item" onClick={this.ToJoin}>Join</a>
                        </div>
                    </div>
                <button type="button" class="btn btn-dark">Contact</button>
                </div>
            </div>
        );
    }

}