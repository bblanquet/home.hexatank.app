export class Message {
	Name: string;
	Content: string;

	public static Create(name: string, content: string): Message {
		const m = new Message();
		m.Content = content;
		m.Name = name;
		return m;
	}
}
