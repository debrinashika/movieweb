export class Film {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public director: string,
    public release_year: number,
    public genre: string[],
    public price: number,
    public duration: number,
    public video_url: string | null,
    public cover_image_url: string | null,
    public created_at: Date,
    public updated_at: Date,
    public ownerId: string,
     ) {}

  validateTitle(): boolean {
    return this.title.length > 0;
  }

  validateDirector(): boolean {
    return this.director.length > 0;
  }

  validatePrice(): boolean {
    return this.price >= 0;
  }
}
