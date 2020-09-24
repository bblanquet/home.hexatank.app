import { Component, h } from 'preact';
import { route } from 'preact-router';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import BlueButtonComponent from '../Common/Button/Stylish/BlueButtonComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';

export default class BlueCampaignComponent extends Component<any, any> {
	private _isFirstRender = true;
	private _mouthTimer: NodeJS.Timer;
	private _eyesTimer: NodeJS.Timer;

	constructor(props: any) {
		super(props);
		this.setState({
			IaNumber: 1,
			Mode: '0',
			MapType: 'Flower',
			Size: '12'
		});
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	componentWillUnmount() {
		clearInterval(this._eyesTimer);
		clearInterval(this._mouthTimer);
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle">
				<div class="container-center">
					<div class="logo-container">
						<div class="fill-blueArmy" />
					</div>
					<div class="container-center-horizontal">
						<BlackButtonComponent
							icon={'fas fa-long-arrow-alt-left'}
							title={''}
							isFirstRender={this._isFirstRender}
							callBack={() => this.RedCampaign()}
						/>
					</div>
					<div class="row justify-content-center">
						<div class="col-auto container-center">
							<BlueButtonComponent
								icon={'fas fa-arrow-alt-circle-right'}
								title={'1'}
								isFirstRender={this._isFirstRender}
								callBack={() => this.Start()}
							/>
						</div>
						<div class="col-auto container-center">
							<BlueButtonComponent
								icon={'fas fa-arrow-alt-circle-right'}
								title={'2'}
								isFirstRender={this._isFirstRender}
								callBack={() => this.Start()}
							/>
						</div>
						<div class="w-100 d-none d-md-block " />
						<div class="col-auto container-center">
							<BlueButtonComponent
								icon={'fas fa-arrow-alt-circle-right'}
								title={'3'}
								isFirstRender={this._isFirstRender}
								callBack={() => this.Start()}
							/>
						</div>
						<div class="col-auto container-center">
							<BlueButtonComponent
								icon={'fas fa-arrow-alt-circle-right'}
								title={'4'}
								isFirstRender={this._isFirstRender}
								callBack={() => this.Start()}
							/>
						</div>
					</div>
					<BlackButtonComponent
						icon={'fas fa-undo-alt'}
						title={'Back'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.Back()}
					/>
				</div>
			</div>
		);
	}

	private Back() {
		route('/Home', true);
	}

	private RedCampaign() {
		route('/Campaign', true);
	}

	Start(): void {
		GameHelper.MapContext = new MapGenerator().GetMapDefinition(
			+this.state.Size,
			this.state.MapType,
			+this.state.IaNumber + 1,
			+this.state.Mode as MapMode
		);
		GameHelper.MapContext.Hqs[0].PlayerName = GameHelper.MapContext.PlayerName;
		let index = 0;
		GameHelper.MapContext.Hqs.forEach((hq) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
		route('/Canvas', true);
	}
}
