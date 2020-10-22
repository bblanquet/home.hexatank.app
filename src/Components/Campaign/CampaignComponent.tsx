import { Component, h } from 'preact';
import { route } from 'preact-router';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapEnv } from '../../Core/Setup/Generator/MapEnv';
import { IAppService } from '../../Services/App/IAppService';
import { Factory, FactoryKey } from '../../Factory';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';

export default class CampaignComponent extends Component<any, any> {
	private _eyesDiv: HTMLDivElement;
	private _mouthDiv: HTMLDivElement;
	private _mouthTimer: NodeJS.Timer;
	private _eyesTimer: NodeJS.Timer;
	private _eyes: Array<string> = [ 'fill-redArmy-eyes', 'fill-redArmy-eyes-blink' ];
	private _eyesIndex = 0;
	private _mouths: Array<string> = [ 'fill-redArmy-mouth-1', 'fill-redArmy-mouth-2', 'fill-redArmy-mouth-3' ];
	private _mouthIndex = 0;

	private _lockDiv: any;
	private _lockDiv2: any;
	private _lockDiv3: any;

	constructor(props: any) {
		super(props);
		this.setState({
			IaNumber: 1,
			Mode: '0',
			MapType: 'Flower',
			Size: '8'
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
							<div class="fill-redArmy" />
							<div
								class="fill-redArmy-eyes"
								ref={(dom) => {
									this._eyesDiv = dom;
								}}
							/>
							<div
								class="fill-redArmy-mouth-1"
								ref={(dom) => {
									this._mouthDiv = dom;
								}}
							/>
						</div>
						<div class="container-center-horizontal">
							<ButtonComponent
								callBack={() => {
									this.BlueCampaign();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-long-arrow-alt-right" />
							</ButtonComponent>
						</div>
						<div class="row justify-content-center">
							<div class="col-auto container-center">
								<ButtonComponent
									callBack={() => {
										this.Start();
									}}
									color={ColorKind.Red}
								>
									<Icon Value="fas fa-arrow-alt-circle-right" /> 1
								</ButtonComponent>
							</div>
							<div class="col-auto container-center">
								<ButtonComponent
									ref={(e: any) => {
										this._lockDiv = e;
									}}
									callBack={() => {
										this._lockDiv.base.classList.remove('bounce');
										setTimeout(() => {
											this._lockDiv.base.classList.add('bounce');
										}, 10);
									}}
									color={ColorKind.Yellow}
								>
									<Icon Value="fas fa-lock" />
								</ButtonComponent>
							</div>
							<div class="w-100 d-none d-md-block " />
							<div class="col-auto container-center">
								<ButtonComponent
									ref={(e: any) => {
										this._lockDiv2 = e;
									}}
									callBack={() => {
										this._lockDiv2.base.classList.remove('bounce');
										setTimeout(() => {
											this._lockDiv2.base.classList.add('bounce');
										}, 10);
									}}
									color={ColorKind.Yellow}
								>
									<Icon Value="fas fa-lock" />
								</ButtonComponent>
							</div>
							<div class="col-auto container-center">
								<ButtonComponent
									ref={(e: any) => {
										this._lockDiv3 = e;
									}}
									callBack={() => {
										this._lockDiv3.base.classList.remove('bounce');
										setTimeout(() => {
											this._lockDiv3.base.classList.add('bounce');
										}, 10);
									}}
									color={ColorKind.Yellow}
								>
									<Icon Value="fas fa-lock" />
								</ButtonComponent>
							</div>
						</div>
						<ButtonComponent
							callBack={() => {
								this.Back();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</ButtonComponent>
					</div>
				</div>
			</Redirect>
		);
	}

	private Back() {
		route('/Home', true);
	}

	private BlueCampaign() {
		route('/BlueCampaignComponent', true);
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
