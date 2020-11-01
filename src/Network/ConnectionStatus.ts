import { ConnectionKind } from './ConnectionKind';
export class ConnectionStatus {
	public Kind: ConnectionKind = ConnectionKind.Nok;
	public State: string = '';
	public Type: string;

	public SetConnection(message: string): void {
		this.State = message;
		if (message === 'connected' || message === 'completed') {
			this.Kind = ConnectionKind.Ok;
		} else if (message === 'new' || message === 'checking') {
			this.Kind = ConnectionKind.Connecting;
		} else {
			this.Kind = ConnectionKind.Nok;
		}
	}

	public IsNotConnected(): boolean {
		return this.Kind !== ConnectionKind.Ok;
	}
}
