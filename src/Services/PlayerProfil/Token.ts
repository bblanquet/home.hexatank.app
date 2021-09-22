import { ErrorCat, ErrorHandler } from '../../Utils/Exceptions/ErrorHandler';

export class Token {
	private _header: string;
	private _payload: string;
	private _signature: string;
	private _content: TokenPayload;

	public constructor(public data: string) {
		const splitData = this.data.split('.');
		if (splitData.length !== 3) {
			ErrorHandler.Throw(ErrorCat.invalidParameter, 'token should be composed of three parts.');
		} else {
			this._header = splitData[0];
			this._payload = splitData[1];
			this._signature = splitData[2];
			this._content = JSON.parse(atob(this._payload)) as TokenPayload;
		}
	}

	public GetContent(): string {
		return this.data;
	}

	public GetPayload(): TokenPayload {
		return this._content;
	}

	public IsValid(): boolean {
		return Date.now() < this._content.exp * 1000;
	}
}

export class TokenPayload {
	public name: string;
	public nbf: number; //not before
	public exp: number; // expired
	public iat: number; //issued at
}
