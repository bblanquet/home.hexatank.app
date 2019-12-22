import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SinglePlayerState } from './SinglePlayerState';
import linkState from 'linkstate'; 
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import { SpriteProvider } from '../../Core/Utils/SpriteProvider';

export default class SinglePlayerComponent extends Component<any, SinglePlayerState> {

    constructor(props: any) {
        super(props);
        this.setState({
            IaNumber: 1,
            Mode:"0"
        });
        SpriteProvider.GetAssets().forEach(a=>{
            var preloadLink = document.createElement("link");
            preloadLink.href = a;
            preloadLink.crossOrigin="anonymous";
            preloadLink.rel = "preload";
            preloadLink.as = "image";
            document.head.appendChild(preloadLink);
        });
    }

    render() {
        return (
            <div class="base">
                <div class="centered">
                    <div class="container">
                    <div class="title-container">Single player</div>
                    <div class="col-auto my-1">
                            <label class="mr-sm-2 whiteText" for="inlineFormCustomSelect">IA</label>
                            <select onChange={linkState(this, 'IaNumber')} class="custom-select mr-sm-2" id="inlineFormCustomSelect">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                        </div>
                        <div class="col-auto my-1 whiteText">
                            <label class="mr-sm-2" for="inlineFormCustomSelect">Mode</label>
                            <select onChange={linkState(this, 'Mode')} class="custom-select mr-sm-2" id="inlineFormCustomSelect">
                                <option value="0">Sand</option>
                                <option value="1">Forest</option>
                            </select>
                        </div>
                        <p></p>
                        <div class="btn-group btn-group-space" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-dark btn-sm" onClick={(e) => this.Start(e)}>Start</button>
                            <button type="button" class="btn btn-primary btn-sm btn-danger" onClick={(e) => this.Back(e)}>Back</button>
                        </div>
                    </div>
                </div>
            </div>)
    }

    private Back(e: any) {
        route('/Home', true);
    }

    Start(e: MouseEvent): void {
        PlaygroundHelper.MapContext = new MapGenerator().GetMapDefinition(+this.state.IaNumber + 1, (+this.state.Mode) as MapMode);
        PlaygroundHelper.SetDefaultName();
        PlaygroundHelper.MapContext.Hqs[0].PlayerName = PlaygroundHelper.PlayerName;
        let index = 0;
        PlaygroundHelper.MapContext.Hqs.forEach(hq => {
            if (!hq.PlayerName) {
                hq.isIa = true;
                hq.PlayerName = `IA${index}`;
            }
            index += 1;
        });
        route('/Canvas', true);
    }
}