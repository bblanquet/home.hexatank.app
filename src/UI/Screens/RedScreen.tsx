import { Component, h } from 'preact';
import { route } from 'preact-router';
import { IAppService } from '../../Services/App/IAppService';
import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { Singletons, SingletonKey } from '../../Singletons';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { LockButton } from '../Common/Button/Stylish/LockButton';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { Sentences } from '../Model/Sentences';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { Face } from '../Components/Face';
import Navbar from '../Components/Navbar';
import Redirect from '../Components/Redirect';
import Visible from '../Components/Visible';

export default class RedScreen extends Component<
	any,
	{ HasBubble: boolean; level: number; Sentence: string; CurrentSentence: string }
> {
	private _campaignService: ICampaignService;

	constructor(props: any) {
		super(props);
		this._campaignService = Singletons.Load<ICampaignService>(SingletonKey.Campaign);
	}

	render() {
		return (
			<Redirect>
				<Navbar>
					<div class="generalContainer absolute-center-middle">
						<div class="container-center">
							<Face
								eyes={[ 'fill-redArmy-eyes', 'fill-redArmy-eyes-blink' ]}
								mouths={[ 'fill-redArmy-mouth-1', 'fill-redArmy-mouth-2', 'fill-redArmy-mouth-3' ]}
								face={'fill-redArmy'}
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
									color={ColorKind.Red}
								>
									<Icon Value="fas fa-fist-raised" /> Fight
								</ButtonComponent>
							</div>
						</Visible>
						<div class="container-center">
							<Visible isVisible={!this.state.HasBubble}>
								<div class="container-center-horizontal">
									<ButtonComponent
										callBack={() => {
											this.Training();
										}}
										color={ColorKind.Black}
									>
										<Icon Value="fas fa-long-arrow-alt-left" />
									</ButtonComponent>
									<ButtonComponent
										callBack={() => {
											this.BlueCampaign();
										}}
										color={ColorKind.Black}
									>
										<Icon Value="fas fa-long-arrow-alt-right" />
									</ButtonComponent>
								</div>
								<div class="d-flex flex-wrap justify-content-center">
									{this._campaignService.GetButtons(CampaignKind.red).map((isPossible, index) => {
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
							</Visible>
						</div>
					</div>
				</Navbar>
			</Redirect>
		);
	}

	private Back() {
		route('{{sub_path}}Home', true);
	}

	private BlueCampaign() {
		route('{{sub_path}}Blue', true);
	}

	private Training() {
		route('{{sub_path}}Training', true);
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

	private GetButton(index: number) {
		return (
			<ButtonComponent
				callBack={() => {
					this.setState({
						HasBubble: !this.state.HasBubble,
						level: index,
						Sentence: Sentences[Math.round((Sentences.length - 1) * Math.random())],
						CurrentSentence: ''
					});
					setTimeout(() => {
						this.TextAnimation();
					}, 100);
				}}
				color={ColorKind.Red}
			>
				<Icon Value="fas fa-arrow-alt-circle-right" /> {index}
			</ButtonComponent>
		);
	}

	Start(index: number): void {
		const mapContext = this._campaignService.GetMapContext(CampaignKind.red, index);
		Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App).Register(mapContext);
		route('{{sub_path}}Canvas', true);
	}
}
