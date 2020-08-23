import { PacketKind } from '../Network/Message/PacketKind';
import { NetworkMessage } from '../Network/Message/NetworkMessage';
import { KindEventObserver } from '../Core/Utils/Events/KindEventObserver';

export class NetworkObserver extends KindEventObserver<PacketKind, NetworkMessage<any>> {}
