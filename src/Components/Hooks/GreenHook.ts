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
import { GreenSentences } from '../Model/Dialogues';
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

	public Start(index: number): void {
		const blueprint = this._campaignService.GetBlueprint(CampaignKind.training, index);
		if (index === 1) {
			this.Build(SingletonKey.CamouflageBuilder, blueprint, index - 1, 20, 3);
			route('{{sub_path}}Camouflage', true);
		} else if (index === 2) {
			this.Build(SingletonKey.FireV2Builder, blueprint, index - 1, 20, 3);
			route('{{sub_path}}FireV2', true);
		} else if (index === 3) {
			this.Build(SingletonKey.OutpostBuilder, blueprint, index - 1, 20, 3);
			route('{{sub_path}}Outpost', true);
		} else if (index === 4) {
			this.Build(SingletonKey.DiamondBuilder, blueprint, index - 1, 20, 3);
			route('{{sub_path}}Diamond', true);
		}
	}

	private Build<T extends IBlueprint>(
		builder: SingletonKey,
		blueprint: T,
		stage: number,
		win: number,
		loose: number
	) {
		Singletons.Load<IBuilder<T>>(builder).Register(
			blueprint,
			() => {
				this._playerProfilService.GetProfil().GreenLvl[stage] = StageState.achieved;
				this._playerProfilService.AddPoints(win);
			},
			() => {
				this._playerProfilService.AddPoints(loose);
			}
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
