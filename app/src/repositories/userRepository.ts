import { PrismaClient } from '@prisma/client';
import { User } from '../models/user';
import { Film } from '../models/film';

export class UserRepository {
  private static instance: UserRepository;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async save(user: User): Promise<User> {
    const savedUser = await this.prisma.user.create({
      data: user.toPrisma(),
    });
    return User.fromPrisma(savedUser);
  }

  async findByUsername(username: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { username } });
    return userData ? User.fromPrisma(userData) : null;
  }

  async findByUsername2(username: string): Promise<User[]> {
    const userData = await this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: 'insensitive', 
        },
      },
    });
    return userData.map(User.fromPrisma);
  }
  

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { email } });
    return userData ? User.fromPrisma(userData) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { id } });
    return userData ? User.fromPrisma(userData) : null;
  }

  async isEmailOrUsernameTaken(email: string, username: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    return !!user;
  }

  async isAlreadyPurchased(user: User, filmId: string): Promise<Film[]> {
    const alreadyPurchased = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { films: { where: { id: filmId } } }
    });

    if (!alreadyPurchased  || alreadyPurchased?.films.length == 0) {
      return [];
    }

    return alreadyPurchased.films.map(filmData => new Film(
      filmData.id,
      filmData.title,
      filmData.description,
      filmData.director,
      filmData.release_year,
      filmData.genre,
      filmData.price,
      filmData.duration,
      filmData.video_url,
      filmData.cover_image_url,
      new Date(filmData.created_at),
      new Date(filmData.updated_at),
      filmData.ownerId
    ));
  }

  async PurhasedFilms(user: User): Promise<Film[]> {
    const alreadyPurchased = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { films :true}
    });

    if (!alreadyPurchased  || alreadyPurchased?.films.length == 0) {
      return [];
    }

    return alreadyPurchased.films.map(filmData => new Film(
      filmData.id,
      filmData.title,
      filmData.description,
      filmData.director,
      filmData.release_year,
      filmData.genre,
      filmData.price,
      filmData.duration,
      filmData.video_url,
      filmData.cover_image_url,
      new Date(filmData.created_at),
      new Date(filmData.updated_at),
      filmData.ownerId
    ));
  }


  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: user.toPrisma(),
    });
    return User.fromPrisma(updatedUser);
  }

  async updateBalance(user: User, film: Film): Promise<User> {
    const updatedUser =await this.prisma.user.update({
      where: { id: user.id },
      data: {
        balance: { decrement: film.price },
        films: { connect: { id: film.id } }
      }
    });
    return User.fromPrisma(updatedUser);
  }

  async findAll(): Promise<User[]> {
    const usersData = await this.prisma.user.findMany();
    return usersData.map(User.fromPrisma);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

}
