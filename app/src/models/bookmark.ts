
export class Bookmark {
  constructor(
    public id: string,
    public userId: string,
    public filmId: string,
  ) {}

  static fromPrisma(userData: any): Bookmark {
    return new Bookmark(
        userData.id,
        userData.userId,
        userData.filmId,
    );
  }

  toPrisma(): any {
    return {
        id: this.id,
        userId: this.userId,
        filmId: this.filmId,
    };
  }
  
}
