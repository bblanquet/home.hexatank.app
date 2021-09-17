import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { CampaignState } from '../Model/GreenState';
import { Hook } from '../Framework/Hook';
import { Blue } from '../Model/Dialogues';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { route } from 'preact-router';
import { IBuilder } from '../../Services/Builder/IBuilder';
import { StateUpdater } from 'preact/hooks';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { Singletons, SingletonKey } from '../../Singletons';
import { StageState } from '../../Services/Campaign/StageState';

export class BlueHook extends Hook<CampaignState> {
	private _timeout: NodeJS.Timeout;
	private _campaignService: ICampaignService;
	private _playerProfilService: IPlayerProfileService;

	public constructor(public State: CampaignState, protected SetState: StateUpdater<CampaignState>) {
		super(State, SetState);
		this._campaignService = Singletons.Load<ICampaignService>(SingletonKey.Campaign);
		this._playerProfilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
	}

	public GetStages(): StageState[] {
		return this._campaignService.GetStages(CampaignKind.blue);
	}

	static DefaultState(): CampaignState {
		return new CampaignState();
	}

	public Back() {
		route('{{sub_path}}Home', true);
	}

	public Red() {
		route('{{sub_path}}Red', true);
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

	public Start(): void {
		const blueprint = this._campaignService.GetBlueprint(CampaignKind.blue, this.State.Level);
		const profile = this._playerProfilService.GetProfile();
		Singletons.Load<IBuilder<GameBlueprint>>(SingletonKey.GameBuilder).Register(
			blueprint as any,
			() => {
				profile.BlueLvl[this.State.Level - 1] = StageState.achieved;
				if (
					this.State.Level < profile.BlueLvl.length &&
					profile.BlueLvl[this.State.Level] === StageState.lock
				) {
					profile.BlueLvl[this.State.Level] = StageState.unlock;
				}
				this._playerProfilService.AddPoints(20);
			},
			() => this._playerProfilService.AddPoints(3)
		);
		route('{{sub_path}}BlueGame', true);
	}

	public Select(level: number): void {
		this.Update((e) => {
			e.HasBubble = !e.HasBubble;
			e.Level = level;
			e.Sentence = Blue[Math.round((Blue.length - 1) * Math.random())];
			e.CurrentSentence = '';
		});
		setTimeout(() => {
			this.TextAnimation();
		}, 100);
	}
}
