import { StateUpdater } from 'preact/hooks';
import { Hook } from './Hook';
import { IBuilder } from '../../Services/Builder/IBuilder';
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { Singletons, SingletonKey } from '../../Singletons';
import { CampaignState } from '../Model/GreenState';
import { route } from 'preact-router';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { StageState } from '../../Services/Campaign/StageState';
import { Green } from '../Model/Dialogues';
import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';

export class GreenHook extends Hook<CampaignState> {
	private _playerProfilService: IPlayerProfileService;
	private _campaignService: ICampaignService;
	private _timeout: NodeJS.Timeout;

	public constructor(public State: CampaignState, protected SetState: StateUpdater<CampaignState>) {
		super(State, SetState);
		this._campaignService = Singletons.Load<ICampaignService>(SingletonKey.Campaign);
		this._playerProfilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
	}

	public Unmount(): void {
		clearTimeout(this._timeout);
	}

	public static DefaultState(): CampaignState {
		return new CampaignState();
	}

	public Start(): void {
		const blueprint = this._campaignService.GetBlueprint(CampaignKind.training, this.State.Level);
		if (this.State.Level === 1) {
			this.Build(SingletonKey.CamouflageBuilder, blueprint, 20, 3);
			route('{{sub_path}}Camouflage', true);
		} else if (this.State.Level === 2) {
			this.Build(SingletonKey.FireBuilder, blueprint, 20, 3);
			route('{{sub_path}}Fire', true);
		} else if (this.State.Level === 3) {
			this.Build(SingletonKey.OutpostBuilder, blueprint, 20, 3);
			route('{{sub_path}}Outpost', true);
		} else if (this.State.Level === 4) {
			this.Build(SingletonKey.DiamondBuilder, blueprint, 20, 3);
			route('{{sub_path}}Diamond', true);
		} else if (this.State.Level === 5) {
			this.Build(SingletonKey.MultioutpostBuilder, blueprint, 20, 3);
			route('{{sub_path}}Multioutpost', true);
		}
	}

	private Build<T extends IBlueprint>(builder: SingletonKey, blueprint: T, win: number, loose: number) {
		const profile = this._playerProfilService.GetProfile();

		Singletons.Load<IBuilder<T>>(builder).Register(
			blueprint,
			() => {
				profile.GreenLvl[this.State.Level - 1] = StageState.achieved;
				if (
					this.State.Level < profile.GreenLvl.length &&
					profile.GreenLvl[this.State.Level] === StageState.lock
				) {
					profile.GreenLvl[this.State.Level] = StageState.unlock;
				}
				this._playerProfilService.AddPoints(20);
			},
			() => this._playerProfilService.AddPoints(3)
		);
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
	public BlueCampaign() {
		route('{{sub_path}}Blue', true);
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
			e.Sentence = Green[Math.round((Green.length - 1) * Math.random())];
			e.CurrentSentence = '';
		});
		setTimeout(() => {
			this.TextAnimation();
		}, 100);
	}
}
