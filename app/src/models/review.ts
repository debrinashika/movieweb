
export class Review {
    constructor(
        public id: string,
        public rating: number,
        public comment: string,
        public userId: string,
        public filmId: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
  
    static fromPrisma(userData: any): Review {
      return new Review(
          userData.id,
          userData.rating,
          userData.comment,
          userData.userId,
          userData.filmId,
          userData.createdAt,
          userData.updatedAt
      );
    }
  
    toPrisma(): any {
      return {
            id: this.id,
            rating: this.rating,
            comment: this.comment,
            userId: this.userId,
            filmId: this.filmId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
      };
    }
    
  }
  