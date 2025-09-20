import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async save(user: User): Promise<User> {
    const model = await this.userModel
      .build({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as any)
      .save();
    return new User(
      model.id,
      model.name,
      model.email,
      model.createdAt,
      model.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.userModel.findByPk(id);
    if (!model) return null;
    return new User(
      model.id,
      model.name,
      model.email,
      model.createdAt,
      model.updatedAt,
    );
  }

  async findAll(): Promise<User[]> {
    const models = await this.userModel.findAll();
    return models.map(
      (model) =>
        new User(
          model.id,
          model.name,
          model.email,
          model.createdAt,
          model.updatedAt,
        ),
    );
  }

  async update(user: User): Promise<User> {
    await this.userModel.update(
      {
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
      },
      { where: { id: user.id } },
    );
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.userModel.destroy({ where: { id } });
  }
}
