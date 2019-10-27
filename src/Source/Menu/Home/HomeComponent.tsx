import { h, Component } from 'preact';
import { route } from 'preact-router';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';

export default class HomeComponent extends Component<any, any> {

    constructor() {
        PlaygroundHelper.InitApp();
        super();
    }

    private ToSinglePlayer(e: any): void {
        route('/SinglePlayer', true);
    }

    private ToHost(e: any): void {
        route('/OffHost', true);
    }

    private ToJoin(e: any): void {
        route('/OffJoin', true);
    }

    componentDidMount() {
    }

    componentWillUnmount() { }

    render() {
        return (
            <div class="base">
                <div class="centered">
                    <div class="container">
                    <div class="title-container">Program 6</div>
                        <div class="relative-center">
                            <div class="btn-group-vertical btn-block">
                                <button type="button" class="btn btn-primary-blue btn-block" onClick={this.ToSinglePlayer}>Single player</button>
                                <div class="btn-group btn-primary-blue btn-block" role="group">
                                    <button id="btnGroupDrop1" type="button" class="btn btn-primary-blue btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Multiplayers
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                        <a class="dropdown-item" onClick={this.ToHost}>Host</a>
                                        <a class="dropdown-item" onClick={this.ToJoin}>Join</a>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-primary-blue btn-block">Contact</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}