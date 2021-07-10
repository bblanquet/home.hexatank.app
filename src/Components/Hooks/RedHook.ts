import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { CampaignState } from '../Model/GreenState';
import { Hook } from './Hook';
import { RedSentences } from '../Model/Text';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { route } from 'preact-router';
import { IAppService } from '../../Services/App/IAppService';
import { StateUpdater } from 'preact/hooks';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { Singletons, SingletonKey } from '../../Singletons';
import { StageState } from '../../Services/Campaign/StageState';

export class RedHook extends Hook<CampaignState> {
	private _timeout: NodeJS.Timeout;
	private _campaignService: ICampaignService;
	private _playerProfilService: IPlayerProfilService;

	public constructor(public State: CampaignState, protected SetState: StateUpdater<CampaignState>) {
		super(State, SetState);
		this._campaignService = Singletons.Load<ICampaignService>(SingletonKey.Campaign);
		this._playerProfilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
	}

	public GetStages(): StageState[] {
		return this._campaignService.GetStages(CampaignKind.red);
	}

	static DefaultState(): CampaignState {
		return new CampaignState();
	}

	public Back() {
		route('{{sub_path}}Home', true);
	}

	public Blue() {
		route('{{sub_path}}Blue', true);
	}

	public Green() {
		route('{{sub_path}}Green', true);
	}

	public Unmount(): void {
		clearTimeout(this._timeout);
	}

	private TextAnimation(): void {
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

	public SetBubble(): void {
		this.Update((e) => {
			e.HasBubble = !e.HasBubble;
		});
	}

	public Start(index: number): void {
		const mapContext = this._campaignService.GetMapContext(CampaignKind.red, index);
		Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App).Register(
			mapContext,
			() => {
				this._playerProfilService.GetProfil().RedLvl[index] = StageState.achieved;
				if (index + 1 < this._playerProfilService.GetProfil().RedLvl.length) {
					this._playerProfilService.GetProfil().RedLvl[index + 1] = StageState.unlock;
				}
				this._playerProfilService.AddPoints(20);
			},
			() => {
				this._playerProfilService.AddPoints(3);
			}
		);
		route('{{sub_path}}Canvas', true);
	}

	public Select(level: number): void {
		this.Update((e) => {
			e.HasBubble = !e.HasBubble;
			e.Level = level;
			e.Sentence = RedSentences[Math.round((RedSentences.length - 1) * Math.random())];
			e.CurrentSentence = '';
		});
		setTimeout(() => {
			this.TextAnimation();
		}, 100);
	}
}
