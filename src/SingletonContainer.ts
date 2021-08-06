import { SocketService } from './Services/Socket/SocketService';
import { AnalyzeService } from './Services/Analyse/AnalyzeService';
import { DiamondworldService } from './Services/World/DiamondworldService';
import { FireworldService } from './Services/World/FireworldService';
import { FireV2worldService } from './Services/World/FireV2worldService';
import { OutpostworldService } from './Services/World/OutpostworldService';
import { CamouflageworldService } from './Services/World/CamouflageworldService';
import { CamouflageInteractionService } from './Services/Interaction/CamouflageInteractionService';
import { CamBuilder } from './Services/Builder/CamBuilder';
import { PlayerProfilService } from './Services/PlayerProfil/PlayerProfilService';
import { CampaignService } from './Services/Campaign/CampaignService';
import { OnlineService } from './Services/Online/OnlineService';
import { KeyService } from './Services/Key/KeyService';
import { RecordInteractionService } from './Services/Interaction/RecordInteractionService';
import { CompareService } from './Services/Compare/CompareService';
import { GameworldService } from './Services/World/GameworldService';
import { BlueprintService } from './Services/Blueprint/BlueprintService';
import { LayerService } from './Services/Layer/LayerService';
import { AppService } from './Services/App/AppService';
import { InteractionService } from './Services/Interaction/InteractionService';
import { RecordService } from './Services/Record/RecordService';
import { RecordContextService } from './Services/Record/RecordContextService';
import { UpdateService } from './Services/Update/UpdateService';
import { StatsService } from './Services/Stats/StatsService';
import { GameBuilder } from './Services/Builder/GameBuilder';
import { GenericBuilder } from './Services/Builder/GenericBuilder';
import { Singletons, SingletonKey } from './Singletons';
import { SmallBlueprint } from './Core/Framework/Blueprint/Small/SmallBlueprint';
import { Multioutpostworld } from './Core/Framework/World/Multioutpostworld';
import { DiamondBlueprint } from './Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { Diamondworld } from './Core/Framework/World/Diamondworld';
import { GameBlueprint } from './Core/Framework/Blueprint/Game/GameBlueprint';
import { Gameworld } from './Core/Framework/World/Gameworld';
import { Fireworld } from './Core/Framework/World/Fireworld';
import { Outpostworld } from './Core/Framework/World/Outpostworld';

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
		Singletons.Register(SingletonKey.Multioutpostworld, new FireworldService());
		Singletons.Register(SingletonKey.Fireworld, new FireV2worldService());
		Singletons.Register(SingletonKey.Outpostworld, new OutpostworldService());
		Singletons.Register(SingletonKey.Diamondworld, new DiamondworldService());

		Singletons.Register(SingletonKey.Blueprint, new BlueprintService());
		Singletons.Register(SingletonKey.Interaction, new InteractionService());
		Singletons.Register(SingletonKey.RecordInteraction, new RecordInteractionService());
		Singletons.Register(SingletonKey.CamouflageInteraction, new CamouflageInteractionService());

		Singletons.Register(SingletonKey.GameBuilder, new GameBuilder());
		Singletons.Register(
			SingletonKey.PlayerBuilder,
			new GenericBuilder<GameBlueprint, Gameworld>(SingletonKey.PlayerBuilder, SingletonKey.Gameworld)
		);
		Singletons.Register(SingletonKey.CamouflageBuilder, new CamBuilder());
		Singletons.Register(
			SingletonKey.MultioutpostBuilder,
			new GenericBuilder<SmallBlueprint, Multioutpostworld>(
				SingletonKey.MultioutpostBuilder,
				SingletonKey.Multioutpostworld
			)
		);
		Singletons.Register(
			SingletonKey.FireBuilder,
			new GenericBuilder<SmallBlueprint, Fireworld>(SingletonKey.FireBuilder, SingletonKey.Fireworld)
		);
		Singletons.Register(
			SingletonKey.DiamondBuilder,
			new GenericBuilder<DiamondBlueprint, Diamondworld>(SingletonKey.DiamondBuilder, SingletonKey.Diamondworld)
		);
		Singletons.Register(
			SingletonKey.OutpostBuilder,
			new GenericBuilder<SmallBlueprint, Outpostworld>(SingletonKey.OutpostBuilder, SingletonKey.Outpostworld)
		);

		Singletons.Register(SingletonKey.Campaign, new CampaignService());
		Singletons.Register(SingletonKey.Analyze, new AnalyzeService());
	}
}
