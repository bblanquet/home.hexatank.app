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

Factory.Register(FactoryKey.Key, new KeyService());
Factory.Register(FactoryKey.Hosting, new HostingService());
Factory.Register(FactoryKey.Update, new UpdateService());
Factory.Register(FactoryKey.Compare, new CompareService());
Factory.Register(FactoryKey.GameContext, new GameContextService());
Factory.Register(FactoryKey.Layer, new LayerService());
Factory.Register(FactoryKey.Network, new NetworkService());
Factory.Register(FactoryKey.Record, new RecordService());
Factory.Register(FactoryKey.Interaction, new InteractionService());
Factory.Register(FactoryKey.RecordInteraction, new RecordInteractionService());
Factory.Register(FactoryKey.App, new AppService());
Factory.Register(FactoryKey.RecordApp, new RecordAppService());
