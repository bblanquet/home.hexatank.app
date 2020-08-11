import { Component, h } from 'preact';
import { route } from 'preact-router';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import { ComponentsHelper } from '../ComponentsHelper';

export default class CampaignComponent extends Component<any, any> {
	private _isFirstRender = true;
	private _eyesDiv: HTMLDivElement;
	private _mouthDiv: HTMLDivElement;
	private _mouthTimer: NodeJS.Timer;
	private _eyesTimer: NodeJS.Timer;
	private _eyes: Array<string> = [ 'fill-redArmy-eyes', 'fill-redArmy-eyes-blink' ];
	private _eyesIndex = 0;
	private _mouths: Array<string> = [ 'fill-redArmy-mouth-1', 'fill-redArmy-mouth-2', 'fill-redArmy-mouth-3' ];
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
		this._isFirstRender = false;
		this._eyesTimer = setInterval(() => this.EyesAnimation(), 2000);
		this._mouthTimer = setInterval(() => this.MouthAnimation(), 3000);
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
					<div class="row justify-content-center">
						<div class="col-auto container-center">
							{ComponentsHelper.GetRedButton(
								this._isFirstRender,
								'fas fa-arrow-alt-circle-right',
								'1',
								(e) => this.Start(e)
							)}
						</div>
						<div class="col-auto container-center">
							{ComponentsHelper.GetRedButton(
								this._isFirstRender,
								'fas fa-arrow-alt-circle-right',
								'2',
								(e) => this.Start(e)
							)}
						</div>
						<div class="w-100 d-none d-md-block " />
						<div class="col-auto container-center">
							{ComponentsHelper.GetRedButton(
								this._isFirstRender,
								'fas fa-arrow-alt-circle-right',
								'3',
								(e) => this.Start(e)
							)}
						</div>
						<div class="col-auto container-center">
							{ComponentsHelper.GetRedButton(
								this._isFirstRender,
								'fas fa-arrow-alt-circle-right',
								'4',
								(e) => this.Start(e)
							)}
						</div>
					</div>

					{ComponentsHelper.GetBlackButton(this._isFirstRender, 'fas fa-undo-alt', 'Black', (e) =>
						this.Back(e)
					)}
				</div>
			</div>
		);
	}

	private Back(e: any) {
		route('/Home', true);
	}

	Start(e: MouseEvent): void {
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
				hq.PlayerName = `IA${index}`;
			}
			index += 1;
		});
		route('/Canvas', true);
	}
}