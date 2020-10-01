import { Component, h } from 'preact';
import { route } from 'preact-router';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapEnv } from '../../Core/Setup/Generator/MapEnv';
import BlueButtonComponent from '../Common/Button/Stylish/BlueButtonComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import { lazyInject } from '../../inversify.config';
import { IAppService } from '../../Services/App/IAppService';
import { TYPES } from '../../types';

export default class BlueCampaignComponent extends Component<any, any> {
	@lazyInject(TYPES.Empty) private _appService: IAppService;

	private _mouthTimer: any;
	private _eyesTimer: any;

	constructor(props: any) {
		super(props);
		this.setState({
			IaNumber: 1,
			Mode: '0',
			MapType: 'Flower',
			Size: '12'
		});
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
							callBack={() => this.RedCampaign()}
						/>
					</div>
					<div class="row justify-content-center">
						<div class="col-auto container-center">
							<BlueButtonComponent
								icon={'fas fa-arrow-alt-circle-right'}
								title={'1'}
								callBack={() => this.Start()}
							/>
						</div>
						<div class="col-auto container-center">
							<BlueButtonComponent
								icon={'fas fa-arrow-alt-circle-right'}
								title={'2'}
								callBack={() => this.Start()}
							/>
						</div>
						<div class="w-100 d-none d-md-block " />
						<div class="col-auto container-center">
							<BlueButtonComponent
								icon={'fas fa-arrow-alt-circle-right'}
								title={'3'}
								callBack={() => this.Start()}
							/>
						</div>
						<div class="col-auto container-center">
							<BlueButtonComponent
								icon={'fas fa-arrow-alt-circle-right'}
								title={'4'}
								callBack={() => this.Start()}
							/>
						</div>
					</div>
					<BlackButtonComponent icon={'fas fa-undo-alt'} title={'Back'} callBack={() => this.Back()} />
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
		const mapContext = new MapGenerator().GetMapDefinition(
			+this.state.Size,
			this.state.MapType,
			+this.state.IaNumber + 1,
			+this.state.Mode as MapEnv
		);
		mapContext.Hqs[0].PlayerName = mapContext.PlayerName;
		mapContext.Hqs.forEach((hq, index) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
		this._appService.Register(mapContext);
		route('/Canvas', true);
	}
}
