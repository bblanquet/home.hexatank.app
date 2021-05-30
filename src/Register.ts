import { AudioService } from './Services/Audio/SoundService';
import { DiamondContextService } from './Services/GameContext/DiamondContextService';
import { PowerContextService } from './Services/GameContext/PowerContextService';
import { PowerInteractionService } from './Services/Interaction/PowerInteractionService';
import { DiamondInteractionService } from './Services/Interaction/DiamondInteractionService';
import { PowerAppService } from './Services/App/PowerAppService';
import { DiamondAppService } from './Services/App/DiamondAppService';
import { CamouflageGameContextService } from './Services/GameContext/CamouflageGameContextService';
import { CamouflageInteractionService } from './Services/Interaction/CamouflageInteractionService';
import { CamouflageAppService } from './Services/App/CamouflageAppService';
import { PlayerProfilService } from './Services/PlayerProfil/PlayerProfilService';
import { CampaignService } from './Services/Campaign/CampaignService';
import { HostingService } from './Services/Hosting/HostingService';
import { KeyService } from './Services/Key/KeyService';
import { RecordInteractionService } from './Services/Interaction/RecordInteractionService';
import { RecordAppService } from './Services/App/RecordAppService';
import { CompareService } from './Services/Compare/CompareService';
import { GameContextService } from './Services/GameContext/GameContextService';
import { LayerService } from './Services/Layer/LayerService';
import { NetworkService } from './Services/Network/NetworkService';
import { InteractionService } from './Services/Interaction/InteractionService';
import { RecordService } from './Services/Record/RecordService';
import { UpdateService } from './Services/Update/UpdateService';
import { AppService } from './Services/App/AppService';
import { Factory, FactoryKey } from './Factory';

Factory.Register(FactoryKey.PlayerProfil, new PlayerProfilService());
Factory.Register(FactoryKey.Key, new KeyService());
Factory.Register(FactoryKey.Hosting, new HostingService());
Factory.Register(FactoryKey.Update, new UpdateService());
Factory.Register(FactoryKey.Compare, new CompareService());
Factory.Register(FactoryKey.Layer, new LayerService());
Factory.Register(FactoryKey.Network, new NetworkService());
Factory.Register(FactoryKey.Record, new RecordService());

Factory.Register(FactoryKey.GameContext, new GameContextService());
Factory.Register(FactoryKey.CamouflageGameContext, new CamouflageGameContextService());
Factory.Register(FactoryKey.PowerGameContext, new PowerContextService());
Factory.Register(FactoryKey.DiamondGameContext, new DiamondContextService());

Factory.Register(FactoryKey.Interaction, new InteractionService());
Factory.Register(FactoryKey.RecordInteraction, new RecordInteractionService());
Factory.Register(FactoryKey.CamouflageInteraction, new CamouflageInteractionService());
Factory.Register(FactoryKey.PowerInteraction, new PowerInteractionService());
Factory.Register(FactoryKey.DiamondInteraction, new DiamondInteractionService());

Factory.Register(FactoryKey.App, new AppService());
Factory.Register(FactoryKey.RecordApp, new RecordAppService());
Factory.Register(FactoryKey.CamouflageApp, new CamouflageAppService());
Factory.Register(FactoryKey.PowerApp, new PowerAppService());
Factory.Register(FactoryKey.DiamondApp, new DiamondAppService());

Factory.Register(FactoryKey.Campaign, new CampaignService());

window.onload = function() {
	//Factory.Register(FactoryKey.Audio, new AudioService());
};
