import { CompareService } from './Services/Compare/CompareService';
import { GameContextService } from './Services/GameContext/GameContextService';
import { LayerService } from './Services/Layer/LayerService';
import { NetworkService } from './Services/Network/NetworkService';
import { InteractionService } from './Services/Interaction/InteractionService';
import { RecordService } from './Services/Record/RecordService';
import { UpdateService } from './Services/Update/UpdateService';
import { AppService } from './Services/App/AppService';
import { Factory, FactoryKey } from './Factory';

Factory.Register(FactoryKey.Update, new UpdateService());
Factory.Register(FactoryKey.Compare, new CompareService());
Factory.Register(FactoryKey.GameContext, new GameContextService());
Factory.Register(FactoryKey.Layer, new LayerService());
Factory.Register(FactoryKey.Network, new NetworkService());
Factory.Register(FactoryKey.Record, new RecordService());
Factory.Register(FactoryKey.Interaction, new InteractionService());
Factory.Register(FactoryKey.App, new AppService());
