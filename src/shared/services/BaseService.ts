import { Repository, EntityTarget } from 'typeorm';
import { AppDataSource } from '../config/database';
import logger from '../utils/logger';
import { BaseEntity } from '../entities/BaseEntity';

export abstract class BaseService<T extends BaseEntity> {
    protected repository: Repository<T>;

    constructor(entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(entity);
    }

    async findAll(): Promise<T[]> {
        try {
            return await this.repository.find();
        } catch (error) {
            logger.error(`Error finding all ${entity.name}:`, error);
            throw error;
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            return await this.repository.findOneBy({ id } as any);
        } catch (error) {
            logger.error(`Error finding ${entity.name} by id:`, error);
            throw error;
        }
    }

    async create(data: Partial<T>): Promise<T> {
        try {
            const entity = this.repository.create(data as any);
            return await this.repository.save(entity);
        } catch (error) {
            logger.error(`Error creating ${entity.name}:`, error);
            throw error;
        }
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        try {
            await this.repository.update(id, data as any);
            return await this.findById(id);
        } catch (error) {
            logger.error(`Error updating ${entity.name}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.repository.delete(id);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            logger.error(`Error deleting ${entity.name}:`, error);
            throw error;
        }
    }
} 