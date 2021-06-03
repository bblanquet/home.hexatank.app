import { AnalyzeService } from './Services/Analyse/AnalyzeService';
import { AudioService } from './Services/Audio/AudioService';
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
import { NetworkContextService } from './Services/Network/NetworkContextService';
import { InteractionService } from './Services/Interaction/InteractionService';
import { RecordService } from './Services/Record/RecordService';
import { UpdateService } from './Services/Update/UpdateService';
import { AppService } from './Services/App/AppService';
import { Singletons, SingletonKey } from './Singletons';

Singletons.Register(SingletonKey.PlayerProfil, new PlayerProfilService());
Singletons.Register(SingletonKey.Key, new KeyService());
Singletons.Register(SingletonKey.Hosting, new HostingService());
Singletons.Register(SingletonKey.Update, new UpdateService());
Singletons.Register(SingletonKey.Compare, new CompareService());
Singletons.Register(SingletonKey.Layer, new LayerService());
Singletons.Register(SingletonKey.Network, new NetworkContextService());
Singletons.Register(SingletonKey.Record, new RecordService());

var context = new AudioContext();
Singletons.Register(SingletonKey.Audio, new AudioService());

Singletons.Register(SingletonKey.GameContext, new GameContextService());
Singletons.Register(SingletonKey.CamouflageGameContext, new CamouflageGameContextService());
Singletons.Register(SingletonKey.PowerGameContext, new PowerContextService());
Singletons.Register(SingletonKey.DiamondGameContext, new DiamondContextService());

Singletons.Register(SingletonKey.Interaction, new InteractionService());
Singletons.Register(SingletonKey.RecordInteraction, new RecordInteractionService());
Singletons.Register(SingletonKey.CamouflageInteraction, new CamouflageInteractionService());
Singletons.Register(SingletonKey.PowerInteraction, new PowerInteractionService());
Singletons.Register(SingletonKey.DiamondInteraction, new DiamondInteractionService());

Singletons.Register(SingletonKey.App, new AppService());
Singletons.Register(SingletonKey.RecordApp, new RecordAppService());
Singletons.Register(SingletonKey.CamouflageApp, new CamouflageAppService());
Singletons.Register(SingletonKey.PowerApp, new PowerAppService());
Singletons.Register(SingletonKey.DiamondApp, new DiamondAppService());

Singletons.Register(SingletonKey.Campaign, new CampaignService());
Singletons.Register(SingletonKey.Analyze, new AnalyzeService());
