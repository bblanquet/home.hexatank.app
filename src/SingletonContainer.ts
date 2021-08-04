import { SocketService } from './Services/Socket/SocketService';
import { AnalyzeService } from './Services/Analyse/AnalyzeService';
import { DiamondworldService } from './Services/World/DiamondworldService';
import { FireworldService } from './Services/World/FireworldService';
import { FireBuilder } from './Services/Builder/FireBuilder';
import { DiamBuilder } from './Services/Builder/DiamBuilder';
import { CamouflageworldService } from './Services/World/CamouflageworldService';
import { CamouflageInteractionService } from './Services/Interaction/CamouflageInteractionService';
import { CamBuilder } from './Services/Builder/CamBuilder';
import { PlayerProfilService } from './Services/PlayerProfil/PlayerProfilService';
import { CampaignService } from './Services/Campaign/CampaignService';
import { OnlineService } from './Services/Online/OnlineService';
import { KeyService } from './Services/Key/KeyService';
import { RecordInteractionService } from './Services/Interaction/RecordInteractionService';
import { PlayerBuilder } from './Services/Builder/PlayerBuilder';
import { CompareService } from './Services/Compare/CompareService';
import { GameworldService } from './Services/World/GameworldService';
import { LayerService } from './Services/Layer/LayerService';
import { AppService } from './Services/App/AppService';
import { InteractionService } from './Services/Interaction/InteractionService';
import { RecordService } from './Services/Record/RecordService';
import { RecordContextService } from './Services/Record/RecordContextService';
import { UpdateService } from './Services/Update/UpdateService';
import { StatsService } from './Services/Stats/StatsService';
import { GameBuilder } from './Services/Builder/GameBuilder';
import { Singletons, SingletonKey } from './Singletons';

export class SingletonContainer {
	Register(): void {
		Singletons.Register(SingletonKey.PlayerProfil, new PlayerProfilService());
		Singletons.Register(SingletonKey.Key, new KeyService());
		Singletons.Register(SingletonKey.Update, new UpdateService());
		Singletons.Register(SingletonKey.Compare, new CompareService());
		Singletons.Register(SingletonKey.Layer, new LayerService());
		Singletons.Register(SingletonKey.Record, new RecordService());
		Singletons.Register(SingletonKey.App, new AppService());

		Singletons.Register(SingletonKey.Stats, new StatsService());
		Singletons.Register(SingletonKey.RecordContext, new RecordContextService());

		Singletons.Register(SingletonKey.Online, new OnlineService());
		Singletons.Register(SingletonKey.Socket, new SocketService());

		Singletons.Register(SingletonKey.Gameworld, new GameworldService());
		Singletons.Register(SingletonKey.Camouflageworld, new CamouflageworldService());
		Singletons.Register(SingletonKey.Fireworld, new FireworldService());
		Singletons.Register(SingletonKey.Diamondworld, new DiamondworldService());

		Singletons.Register(SingletonKey.Interaction, new InteractionService());
		Singletons.Register(SingletonKey.RecordInteraction, new RecordInteractionService());
		Singletons.Register(SingletonKey.CamouflageInteraction, new CamouflageInteractionService());

		Singletons.Register(SingletonKey.GameBuilder, new GameBuilder());
		Singletons.Register(SingletonKey.PlayerBuilder, new PlayerBuilder());
		Singletons.Register(SingletonKey.CamouflageBuilder, new CamBuilder());
		Singletons.Register(SingletonKey.FireBuilder, new FireBuilder());
		Singletons.Register(SingletonKey.DiamondBuilder, new DiamBuilder());

		Singletons.Register(SingletonKey.Campaign, new CampaignService());
		Singletons.Register(SingletonKey.Analyze, new AnalyzeService());
	}
}
