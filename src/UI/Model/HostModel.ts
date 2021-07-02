export class HostModel {
	public RoomName: string = '';
	public PlayerName: string = '';
	public Password: string = '';
	public HasPassword: boolean = false;

	constructor(roomName: string, username: string, password: string, hasPassword: boolean) {
		this.RoomName = roomName;
		this.PlayerName = username;
		this.Password = password;
		this.HasPassword = hasPassword;
	}

	public static New(model: HostModel): HostModel {
		return new HostModel(model.RoomName, model.PlayerName, model.Password, model.HasPassword);
	}
}
