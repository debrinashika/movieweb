import { UserRepository } from '../repositories/userRepository';
import { BookmarkRepository } from '../repositories/bookmarkRepository';
import { User } from '../models/user';
import { generateJWT } from '../utils/jwtUtil';
import { Film } from '../models/film';
import { Bookmark } from '../models/bookmark';

export class UserService {
  private userRepository: UserRepository;
  private bookmarkRepository: BookmarkRepository;

  constructor() {
    this.userRepository = UserRepository.getInstance();
    this.bookmarkRepository = BookmarkRepository.getInstance();
  }

  async register(userData: any): Promise<User> {
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error('All fields are required.');
    }

    const hashedPassword = await User.hashPassword(userData.password);
    const user = new User(
      userData.id,
      userData.username,
      userData.email,
      hashedPassword
    );

    if (!user.validateEmail() || !user.validateUsername() || !user.validatePassword()) {
      throw new Error('Invalid input data.');
    }

    const isTaken = await this.userRepository.isEmailOrUsernameTaken(userData.email, userData.username);
    if (isTaken) {
      throw new Error('Email or Username is already taken.');
    }

    return this.userRepository.save(user);
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
    if (!user || !(await User.comparePassword(password, user.getPassword()))) {
      throw new Error('Invalid credentials.');
    }
    return generateJWT(user);
  }

  async updateUser(id: string, userData: any): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }

    user.username = userData.username || user.username;
    if (userData.password) {
      user.setPassword(await User.hashPassword(userData.password));
    }
    user.email = userData.email || user.email;

    return this.userRepository.update(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async purchaseFilm(user: User, filmId: string): Promise<Film[]> {
    return this.userRepository.isAlreadyPurchased(user, filmId);
  }

  async purchasedFilms(user: User): Promise<Film[]> {
    return this.userRepository.PurhasedFilms(user);
  }

  async updateBalance(user: User, film: Film): Promise<User> {
    return this.userRepository.updateBalance(user, film);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  async findByUsername(id: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  async SearchByUsername(id: string): Promise<User[]> {
    const user = await this.userRepository.findByUsername2(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  async addBookmark(user: User, film:string): Promise<void> {
    return this.bookmarkRepository.save(film, user);
  }

  async getBookmark(user: User): Promise<Film[]> {
    return this.bookmarkRepository.getUserBookmarks(user.id);
  }

  async isBookmarked(user: User, film: string): Promise<boolean> {
    return this.bookmarkRepository.isBookmarked(user,film);
  }

  async deleteBookmarked(bookmark: Bookmark): Promise<any> {
    return this.bookmarkRepository.deleteBookmark(bookmark);
  }

  async getBookmarkId(user: User, film: string): Promise<Bookmark | null> {
    console.log("existingBookmarkw")
    const hh =  await this.bookmarkRepository.getBookmark(user,film);
    console.log(hh)
    console.log("ssss")
    return hh
  }
  
}
