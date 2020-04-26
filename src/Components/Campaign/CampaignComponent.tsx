import { Component, h } from 'preact';
import { route } from 'preact-router';
import linkState from 'linkstate';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../Core/Setup/Generator/MapMode';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';
import { IconProvider } from '../IconProvider';

export default class CampaignComponent extends Component<any, any> {
	private _isFirstRender = true;

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
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle">
				<div class="title-container">Campaign</div>
				<div class="containerStyle ">
					<div class="fill-content-camouflage">
						<div class="fill-border ">
							<div class="text-center">
								<div class="fill-campaign banner-space" />
								<div class="container sub-background-color fit-content ">
									<div class="row justify-content-center">
										<div class="col-auto">
											<button
												type="button"
												class="btn btn-simple-black rounded-pill btn-space"
												onClick={(e) => this.Start(e)}
											>
												<div>
													{IconProvider.GetIcon(
														this._isFirstRender,
														'far fa-play-circle'
													)}{' '}
												</div>{' '}
												1
											</button>
										</div>
										<div class="col-auto">
											<button
												type="button"
												class="btn btn-simple-black rounded-pill btn-space"
												onClick={(e) => this.Start(e)}
											>
												<div>
													{IconProvider.GetIcon(
														this._isFirstRender,
														'far fa-play-circle'
													)}{' '}
												</div>{' '}
												2
											</button>
										</div>
										<div class="w-100 d-none d-md-block " />
										<div class="col-auto">
											<button
												type="button"
												class="btn btn-simple-black rounded-pill btn-space"
												onClick={(e) => this.Start(e)}
											>
												<div>
													{IconProvider.GetIcon(
														this._isFirstRender,
														'far fa-play-circle'
													)}{' '}
												</div>{' '}
												3
											</button>
										</div>
										<div class="col-auto">
											<button
												type="button"
												class="btn btn-simple-black rounded-pill btn-space"
												onClick={(e) => this.Start(e)}
											>
												<div>
													{IconProvider.GetIcon(
														this._isFirstRender,
														'far fa-play-circle'
													)}{' '}
												</div>
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
