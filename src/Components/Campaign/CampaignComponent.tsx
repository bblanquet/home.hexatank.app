import { Component, h } from 'preact';
import { route } from 'preact-router';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { IconProvider } from '../IconProvider';

export default class CampaignComponent extends Component<any, any> {
	private _isFirstRender = true;
	private _redArmyDiv: HTMLDivElement;
	private _redArmyTalkDiv: HTMLDivElement;
	private _talkingTimer: NodeJS.Timer;
	private _timer: NodeJS.Timer;
	private _texts: Array<string> = [
		"Don't cry when you will loose...",
		'I will have no mercy...',
		'I cannot wait to see you loosing...'
	];
	private _textIndex = 0;

	constructor(props: any) {
		super(props);
		this.setState({
			IaNumber: 1,
			Mode: '0',
			MapType: 'Flower',
			Size: '12'
		});
		SpriteProvider.GetAssets().forEach((a) => {
			var preloadLink = document.createElement('link');
			preloadLink.href = a;
			preloadLink.crossOrigin = 'anonymous';
			preloadLink.rel = 'preload';
			preloadLink.as = 'image';
			document.head.appendChild(preloadLink);
		});
	}

	componentDidMount() {
		this._isFirstRender = false;
		this._timer = setInterval(() => this.AnimateRedArmy(), 2000);
		this._talkingTimer = setInterval(() => this.TalkingArmy(), 3000);
	}

	componentWillUnmount() {
		clearInterval(this._timer);
		clearInterval(this._talkingTimer);
	}

	private AnimateRedArmy(): void {
		clearInterval(this._timer);
		if (this._redArmyDiv.classList.contains('fill-redArmy')) {
			this._redArmyDiv.classList.remove('fill-redArmy');
			this._redArmyDiv.classList.add('fill-redArmy-blink');
			this._timer = setInterval(() => this.AnimateRedArmy(), 250);
		} else {
			this._redArmyDiv.classList.remove('fill-redArmy-blink');
			this._redArmyDiv.classList.add('fill-redArmy');
			this._timer = setInterval(() => this.AnimateRedArmy(), 2000);
		}
	}

	private TalkingArmy(): void {
		this._textIndex = (this._textIndex + 1) % this._texts.length;
		this._redArmyTalkDiv.textContent = this._texts[this._textIndex];
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle">
				<div class="title-container fit-content">Campaign</div>
				<div class="containerStyle long">
					<div class="fill-content-camouflage fill-border">
						<div class="campaign-talking">Release areas from the red army.</div>

						<div class="container-center">
							<div
								class="foe-talking"
								ref={(dom) => {
									this._redArmyTalkDiv = dom;
								}}
							>
								don't cry if you loose...
							</div>
							<div class="fill-triangle" />
						</div>

						<div
							class="fill-redArmy banner-space"
							ref={(dom) => {
								this._redArmyDiv = dom;
							}}
						/>
						<div class="sub-background-color fit-content ">
							<div class="row justify-content-center">
								<div class="col-auto">
									<button
										type="button"
										class="btn btn-simple-red rounded-pill btn-space"
										onClick={(e) => this.Start(e)}
									>
										<div class="fill-battle" /> 1
									</button>
								</div>
								<div class="col-auto">
									<button
										type="button"
										class="btn btn-simple-red rounded-pill btn-space"
										onClick={(e) => this.Start(e)}
									>
										<div class="fill-battle" /> 2
									</button>
								</div>
								<div class="w-100 d-none d-md-block " />
								<div class="col-auto">
									<button
										type="button"
										class="btn btn-simple-red rounded-pill btn-space"
										onClick={(e) => this.Start(e)}
									>
										<div class="fill-battle" /> 3
									</button>
								</div>
								<div class="col-auto">
									<button
										type="button"
										class="btn btn-simple-red rounded-pill btn-space"
										onClick={(e) => this.Start(e)}
									>
										<div class="fill-battle" />
										4
									</button>
								</div>
							</div>
						</div>
						<button
							type="button"
							class="btn btn-simple-black rounded-pill very-small-left-margin"
							onClick={(e) => this.Back(e)}
						>
							{IconProvider.GetIcon(this._isFirstRender, 'fas fa-undo-alt')} Back
						</button>
					</div>
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
