import { LogKind } from '../../../Utils/Logger/LogKind';

export class NotificationItem {
	constructor(public Kind: LogKind, public Message: string) {}
}
