export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(name: string, email: string): User {
    const id = crypto.randomUUID();
    const now = new Date();
    return new User(id, name, email, now, now);
  }

  update(name?: string, email?: string): void {
    if (name) this.name = name;
    if (email) this.email = email;
    this.updatedAt = new Date();
  }
}
