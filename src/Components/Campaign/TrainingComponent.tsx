import { Component, h } from 'preact';
import { route } from 'preact-router';
import { IAppService } from '../../Services/App/IAppService';
import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { Singletons, SingletonKey } from '../../Singletons';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { LockButton } from '../Common/Button/Stylish/LockButton';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { FaceComponent } from './FaceComponent';
import NavbarComponent from '../Common/Navbar/NavbarComponent';
import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { PowerBlueprint } from '../../Core/Framework/Blueprint/Power/PowerBlueprint';
import { DiamondBlueprint } from '../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import Visible from '../Common/Visible/VisibleComponent';

export default class TrainingComponent extends Component<any, any> {
	private _campaignService: ICampaignService;

	constructor(props: any) {
		super(props);
		this._campaignService = Singletons.Load<ICampaignService>(SingletonKey.Campaign);
	}

	render() {
		return (
			<Redirect>
				<NavbarComponent>
					<div class="generalContainer absolute-center-middle">
						<div class="container-center">
							<FaceComponent
								eyes={[ 'fill-eyes-training', 'fill-blink-training' ]}
								mouths={[
									'fill-training-mouth-1',
									'fill-training-mouth-2',
									'fill-training-mouth-3',
									'fill-training-mouth-4'
								]}
								face={'fill-training'}
							/>
						</div>
						<Visible isVisible={this.state.HasBubble}>
							<div class="arrow-up" />
							<p class="bubble">{this.state.CurrentSentence}</p>
							<div class="container-center-horizontal">
								<ButtonComponent
									callBack={() => {
										this.setState({
											HasBubble: !this.state.HasBubble
										});
									}}
									color={ColorKind.Black}
								>
									<Icon Value="fas fa-undo-alt" /> Back
								</ButtonComponent>
								<ButtonComponent
									callBack={() => {
										this.Start(this.state.level);
									}}
									color={ColorKind.Green}
								>
									<Icon Value="fas fa-fist-raised" /> Train
								</ButtonComponent>
							</div>
						</Visible>
						<Visible isVisible={!this.state.HasBubble}>
							<div class="container-center">
								<div class="container-center-horizontal">
									<ButtonComponent
										callBack={() => {
											this.RedCampaign();
										}}
										color={ColorKind.Black}
									>
										<Icon Value="fas fa-long-arrow-alt-right" />
									</ButtonComponent>
								</div>
								<div class="d-flex flex-wrap justify-content-center">
									{this._campaignService
										.GetButtons(CampaignKind.training)
										.map((isPossible, index) => {
											if (isPossible) {
												return this.GetButton(index + 1);
											} else {
												return <LockButton />;
											}
										})}
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
						</Visible>
					</div>
				</NavbarComponent>
			</Redirect>
		);
	}

	private Back() {
		route('{{sub_path}}Home', true);
	}

	private RedCampaign() {
		route('{{sub_path}}Campaign', true);
	}

	private GetButton(index: number) {
		return (
			<ButtonComponent
				callBack={() => {
					this.setState({
						HasBubble: !this.state.HasBubble,
						level: index,
						Sentence: this.GetSentence(index),
						CurrentSentence: ''
					});
					setTimeout(() => {
						this.TextAnimation();
					}, 100);
				}}
				color={ColorKind.Green}
			>
				{this.GetIcon(index)}
			</ButtonComponent>
		);
	}

	private GetIcon(index: number) {
		if (index === 1) {
			return <div class="fill-sm-hexa max-width icon-space" />;
		} else if (index === 2) {
			return <div class="fill-sm-tank max-width icon-space" />;
		} else {
			return <div class="fill-sm-diam max-width icon-space" />;
		}
	}

	private GetSentence(index: number) {
		if (index === 1) {
			return 'Make a vehicle reach a specific destination.';
		} else if (index === 2) {
			return 'Make a tank destroy a shield, to reach that goal, you will need to create powerup cells.';
		} else {
			return 'Retrieve at least 50 diamonds for your headquarter, you got 120 seconds soldier.';
		}
	}

	private TextAnimation(): void {
		if (this.state.CurrentSentence.length < this.state.Sentence.length) {
			this.setState({
				CurrentSentence: this.state.Sentence.substring(0, this.state.CurrentSentence.length + 1)
			});
		}

		if (this.state.CurrentSentence.length < this.state.Sentence.length) {
			setTimeout(() => {
				this.TextAnimation();
			}, 50);
		}
	}

	Start(index: number): void {
		const blueprint = this._campaignService.GetMapContext(CampaignKind.training, index);
		if (blueprint instanceof CamouflageBlueprint) {
			Singletons.Load<IAppService<CamouflageBlueprint>>(SingletonKey.CamouflageApp).Register(blueprint);
			route('{{sub_path}}Camouflage', true);
		} else if (blueprint instanceof PowerBlueprint) {
			Singletons.Load<IAppService<PowerBlueprint>>(SingletonKey.PowerApp).Register(blueprint);
			route('{{sub_path}}Power', true);
		} else if (blueprint instanceof DiamondBlueprint) {
			Singletons.Load<IAppService<DiamondBlueprint>>(SingletonKey.DiamondApp).Register(blueprint);
			route('{{sub_path}}Diamond', true);
		}
	}
}
