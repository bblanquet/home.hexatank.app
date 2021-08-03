import { StateUpdater } from 'preact/hooks';
import { Hook } from './Hook';
import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { DiamondBlueprint } from '../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { IAppService } from '../../Services/App/IAppService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { Singletons, SingletonKey } from '../../Singletons';
import { CampaignState } from '../Model/GreenState';
import { route } from 'preact-router';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { StageState } from '../../Services/Campaign/StageState';
import { GreenSentences } from '../Model/Dialogues';

export class GreenHook extends Hook<CampaignState> {
	private _playerProfilService: IPlayerProfilService;
	private _campaignService: ICampaignService;
	private _timeout: NodeJS.Timeout;

	public constructor(public State: CampaignState, protected SetState: StateUpdater<CampaignState>) {
		super(State, SetState);
		this._campaignService = Singletons.Load<ICampaignService>(SingletonKey.Campaign);
		this._playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
	}

	public Unmount(): void {
		clearTimeout(this._timeout);
	}

	public static DefaultState(): CampaignState {
		return new CampaignState();
	}

	public Start(index: number): void {
		const blueprint = this._campaignService.GetBlueprint(CampaignKind.training, index);
		if (blueprint instanceof CamouflageBlueprint) {
			Singletons.Load<IAppService<CamouflageBlueprint>>(SingletonKey.CamouflageApp).Register(
				blueprint,
				() => {
					this._playerProfilService.GetProfil().GreenLvl[0] = StageState.achieved;
					this._playerProfilService.AddPoints(20);
				},
				() => {
					this._playerProfilService.AddPoints(3);
				}
			);
			route('{{sub_path}}Camouflage', true);
		} else if (blueprint instanceof FireBlueprint) {
			Singletons.Load<IAppService<FireBlueprint>>(SingletonKey.FireApp).Register(
				blueprint,
				() => {
					this._playerProfilService.GetProfil().GreenLvl[1] = StageState.achieved;
					this._playerProfilService.AddPoints(20);
				},
				() => {
					this._playerProfilService.AddPoints(3);
				}
			);
			route('{{sub_path}}FireV2', true);
		} else if (blueprint instanceof DiamondBlueprint) {
			Singletons.Load<IAppService<DiamondBlueprint>>(SingletonKey.DiamondApp).Register(
				blueprint,
				() => {
					this._playerProfilService.GetProfil().GreenLvl[2] = StageState.achieved;
					this._playerProfilService.AddPoints(20);
				},
				() => {
					this._playerProfilService.AddPoints(3);
				}
			);
			route('{{sub_path}}Diamond', true);
		}
	}

	public SetBubble(): void {
		this.Update((e) => {
			e.HasBubble = !e.HasBubble;
		});
	}

	public Back() {
		route('{{sub_path}}Home', true);
	}

	public RedCampaign() {
		route('{{sub_path}}Red', true);
	}

	public GetStages(): StageState[] {
		return this._campaignService.GetStages(CampaignKind.training);
	}

	public TextAnimation(): void {
		if (this.State.CurrentSentence.length < this.State.Sentence.length) {
			this.Update((e) => {
				e.CurrentSentence = e.Sentence.substring(0, e.CurrentSentence.length + 1);
			});
		}

		if (this.State.CurrentSentence.length < this.State.Sentence.length) {
			this._timeout = setTimeout(() => {
				this.TextAnimation();
			}, 50);
		}
	}
	public Select(level: number): void {
		this.Update((e) => {
			e.HasBubble = !e.HasBubble;
			e.Level = level;
			e.Sentence = GreenSentences(level);
			e.CurrentSentence = '';
		});
		setTimeout(() => {
			this.TextAnimation();
		}, 100);
	}
}
