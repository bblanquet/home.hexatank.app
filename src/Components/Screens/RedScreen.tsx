import { Component, h } from 'preact';
import { route } from 'preact-router';
import { IAppService } from '../../Services/App/IAppService';
import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { Singletons, SingletonKey } from '../../Singletons';
import Btn from '../Common/Button/Stylish/Btn';
import { LockButton } from '../Common/Button/Stylish/LockButton';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { RedSentences } from '../Model/Text';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { Face } from '../Components/Face';
import StatBar from '../Components/StatBar';
import Redirect from '../Components/Redirect';
import Visible from '../Components/Visible';
import Struct from '../Components/Struct';
import SmBtn from '../Common/Button/Stylish/SmBtn';

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
				<Struct
					header={<StatBar />}
					content={
						<div class="container-center-horizontal">
							<div style="width:80%">
								<div class="container-center">
									<Face
										eyes={[ 'fill-red-eyes-1', 'fill-red-eyes-2' ]}
										mouths={[ 'fill-red-mouth-1', 'fill-red-mouth-2', 'fill-red-mouth-3' ]}
										face={'fill-red-face'}
									/>
								</div>
								<Visible isVisible={this.state.HasBubble}>
									<div class="arrow-up" />
									<p class="bubble">{this.state.CurrentSentence}</p>
									<div class="container-center-horizontal">
										<Btn
											callBack={() => {
												this.setState({
													HasBubble: !this.state.HasBubble
												});
											}}
											color={ColorKind.Black}
										>
											<Icon Value="fas fa-undo-alt" /> Back
										</Btn>
										<Btn
											callBack={() => {
												this.Start(this.state.level);
											}}
											color={ColorKind.Red}
										>
											<Icon Value="fas fa-fist-raised" /> Fight
										</Btn>
									</div>
								</Visible>
								<div class="container-center">
									<Visible isVisible={!this.state.HasBubble}>
										<div class="container-center-horizontal">
											<Btn
												callBack={() => {
													this.Training();
												}}
												color={ColorKind.Black}
											>
												<Icon Value="fas fa-long-arrow-alt-left" />
											</Btn>
											<Btn
												callBack={() => {
													this.BlueCampaign();
												}}
												color={ColorKind.Black}
											>
												<Icon Value="fas fa-long-arrow-alt-right" />
											</Btn>
										</div>
										<div class="d-flex flex-wrap justify-content-center">
											{this._campaignService
												.GetButtons(CampaignKind.red)
												.map((isPossible, index) => {
													if (isPossible) {
														return this.GetButton(index + 1);
													} else {
														return <LockButton />;
													}
												})}
										</div>
									</Visible>
								</div>
							</div>
						</div>
					}
					footer={
						<div class="navbar nav-inner">
							<SmBtn callBack={() => this.Back()} color={ColorKind.Black}>
								<Icon Value="fas fa-undo-alt" /> Back
							</SmBtn>
						</div>
					}
				/>
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

	private _timeout: NodeJS.Timeout;

	componentWillUnmount(): void {
		clearTimeout(this._timeout);
	}

	private TextAnimation(): void {
		if (this.state.CurrentSentence.length < this.state.Sentence.length) {
			this.setState({
				CurrentSentence: this.state.Sentence.substring(0, this.state.CurrentSentence.length + 1)
			});
		}

		if (this.state.CurrentSentence.length < this.state.Sentence.length) {
			this._timeout = setTimeout(() => {
				this.TextAnimation();
			}, 50);
		}
	}

	private GetButton(index: number) {
		return (
			<Btn
				callBack={() => {
					this.setState({
						HasBubble: !this.state.HasBubble,
						level: index,
						Sentence: RedSentences[Math.round((RedSentences.length - 1) * Math.random())],
						CurrentSentence: ''
					});
					setTimeout(() => {
						this.TextAnimation();
					}, 100);
				}}
				color={ColorKind.Red}
			>
				<Icon Value="fas fa-arrow-alt-circle-right" /> {index}
			</Btn>
		);
	}

	Start(index: number): void {
		const mapContext = this._campaignService.GetMapContext(CampaignKind.red, index);
		Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App).Register(mapContext);
		route('{{sub_path}}Canvas', true);
	}
}
