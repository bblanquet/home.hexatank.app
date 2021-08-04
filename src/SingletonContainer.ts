import { SocketService } from './Services/Socket/SocketService';
import { AnalyzeService } from './Services/Analyse/AnalyzeService';
import { DiamondworldService } from './Services/World/DiamondworldService';
import { FireworldService } from './Services/World/FireworldService';
import { FireAppService } from './Services/App/FireAppService';
import { DiamondAppService } from './Services/App/DiamondAppService';
import { CamouflageworldService } from './Services/World/CamouflageworldService';
import { CamouflageInteractionService } from './Services/Interaction/CamouflageInteractionService';
import { CamouflageAppService } from './Services/App/CamouflageAppService';
import { PlayerProfilService } from './Services/PlayerProfil/PlayerProfilService';
import { CampaignService } from './Services/Campaign/CampaignService';
import { OnlineService } from './Services/Online/OnlineService';
import { KeyService } from './Services/Key/KeyService';
import { RecordInteractionService } from './Services/Interaction/RecordInteractionService';
import { PlayerAppService } from './Services/App/PlayerAppService';
import { CompareService } from './Services/Compare/CompareService';
import { GameworldService } from './Services/World/GameworldService';
import { LayerService } from './Services/Layer/LayerService';
import { InteractionService } from './Services/Interaction/InteractionService';
import { RecordService } from './Services/Record/RecordService';
import { UpdateService } from './Services/Update/UpdateService';
import { AppService } from './Services/App/AppService';
import { Singletons, SingletonKey } from './Singletons';

export class SingletonContainer {
	Register(): void {
		Singletons.Register(SingletonKey.PlayerProfil, new PlayerProfilService());
		Singletons.Register(SingletonKey.Key, new KeyService());
		Singletons.Register(SingletonKey.Online, new OnlineService());
		Singletons.Register(SingletonKey.Update, new UpdateService());
		Singletons.Register(SingletonKey.Compare, new CompareService());
		Singletons.Register(SingletonKey.Layer, new LayerService());
		Singletons.Register(SingletonKey.Record, new RecordService());

		Singletons.Register(SingletonKey.Socket, new SocketService());

		Singletons.Register(SingletonKey.GameContext, new GameworldService());
		Singletons.Register(SingletonKey.CamouflageGameContext, new CamouflageworldService());
		Singletons.Register(SingletonKey.FireGameContext, new FireworldService());
		Singletons.Register(SingletonKey.DiamondGameContext, new DiamondworldService());

		Singletons.Register(SingletonKey.Interaction, new InteractionService());
		Singletons.Register(SingletonKey.RecordInteraction, new RecordInteractionService());
		Singletons.Register(SingletonKey.CamouflageInteraction, new CamouflageInteractionService());

		Singletons.Register(SingletonKey.App, new AppService());
		Singletons.Register(SingletonKey.RecordApp, new PlayerAppService());
		Singletons.Register(SingletonKey.CamouflageApp, new CamouflageAppService());
		Singletons.Register(SingletonKey.FireApp, new FireAppService());
		Singletons.Register(SingletonKey.DiamondApp, new DiamondAppService());

		Singletons.Register(SingletonKey.Campaign, new CampaignService());
		Singletons.Register(SingletonKey.Analyze, new AnalyzeService());
	}
}
