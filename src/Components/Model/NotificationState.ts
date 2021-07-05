import { LogKind } from '../../Utils/Logger/LogKind';

export class NotificationState {
	constructor(public Kind: LogKind, public Message: string) {}
}
