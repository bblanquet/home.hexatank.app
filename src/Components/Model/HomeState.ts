import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { HomeKind } from './HomeKind';
import { NotificationState } from './NotificationState';

export class HomeState {
	Kind: HomeKind;
	Notification: LiteEvent<NotificationState>;
	Name: string;
	Password: string;
	Rank: string;
}
