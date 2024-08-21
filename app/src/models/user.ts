import bcrypt from 'bcryptjs';

export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    private password: string,
    public balance: number = 0,
    public role: string = 'user'
  ) {
    this.password = password;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  static fromPrisma(userData: any): User {
    return new User(
      userData.id,
      userData.username,
      userData.email,
      userData.password,
      userData.balance,
      userData.role
    );
  }

  toPrisma(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      balance: this.balance,
      role: this.role,
    };
  }
  
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  validateEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  validateUsername(): boolean {
    return this.username.length >= 3;
  }

  validatePassword(): boolean {
    return this.password.length >= 8;
  }
}
