import { Component, h } from 'preact';
import { route } from 'preact-router';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapEnv } from '../../Core/Setup/Generator/MapEnv';
import BlueButtonComponent from '../Common/Button/Stylish/BlueButtonComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import { Factory, FactoryKey } from '../../Factory';
import { IAppService } from '../../Services/App/IAppService';
import Redirect from '../Redirect/RedirectComponent';

export default class BlueCampaignComponent extends Component<any, any> {
	private _eyesDiv: HTMLDivElement;
	private _mouthDiv: HTMLDivElement;
	private _mouthTimer: NodeJS.Timer;
	private _eyesTimer: NodeJS.Timer;
	private _eyes: Array<string> = [ 'fill-blueArmy-eyes', 'fill-blueArmy-eyes-blink' ];
	private _eyesIndex = 0;
	private _mouths: Array<string> = [ 'fill-blueArmy-mouth-1', 'fill-blueArmy-mouth-2', 'fill-blueArmy-mouth-3' ];
	private _mouthIndex = 0;

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
		this._eyesTimer = setInterval(() => this.EyesAnimation(), 200);
		this._mouthTimer = setInterval(() => this.MouthAnimation(), 200);
	}

	componentWillUnmount() {
		clearInterval(this._eyesTimer);
		clearInterval(this._mouthTimer);
	}

	private EyesAnimation(): void {
		clearInterval(this._eyesTimer);
		let current = this._eyesIndex;
		this._eyesIndex = (this._eyesIndex + 1) % this._eyes.length;
		this._eyesDiv.classList.remove(this._eyes[current]);
		this._eyesDiv.classList.add(this._eyes[this._eyesIndex]);

		if (this._eyesIndex === 0) {
			this._eyesTimer = setInterval(() => this.EyesAnimation(), 2000);
		} else {
			this._eyesTimer = setInterval(() => this.EyesAnimation(), 250);
		}
	}

	private MouthAnimation(): void {
		clearInterval(this._mouthTimer);

		let current = this._mouthIndex;
		this._mouthIndex = (this._mouthIndex + 1) % this._mouths.length;
		this._mouthDiv.classList.remove(this._mouths[current]);
		this._mouthDiv.classList.add(this._mouths[this._mouthIndex]);

		if (this._eyesIndex === 0) {
			this._mouthTimer = setInterval(() => this.MouthAnimation(), 1000);
		} else {
			this._mouthTimer = setInterval(() => this.MouthAnimation(), 100);
		}
	}

	render() {
		return (
			<Redirect>
				<div class="generalContainer absolute-center-middle">
					<div class="container-center">
						<div class="logo-container">
							<div class="fill-blueArmy">
								<div
									class="fill-blueArmy-eyes"
									ref={(dom) => {
										this._eyesDiv = dom;
									}}
								/>
								<div
									class="fill-blueArmy-mouth-1"
									ref={(dom) => {
										this._mouthDiv = dom;
									}}
								/>
							</div>
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
				</div>{' '}
			</Redirect>
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
		Factory.Load<IAppService>(FactoryKey.App).Register(mapContext);
		route('/Canvas', true);
	}
}
