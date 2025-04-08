import { Repository, Like, In } from 'typeorm';
import { BaseService } from '../../shared/services/BaseService';
import { Content } from '../entities/Content';
import { AppDataSource } from '../../shared/config/database';
import logger from '../../shared/utils/logger';

export class ContentService extends BaseService<Content> {
    constructor() {
        super(Content);
    }

    async searchByTitle(title: string): Promise<Content[]> {
        try {
            return await this.repository.find({
                where: {
                    title: Like(`%${title}%`),
                },
            });
        } catch (error) {
            logger.error('Error searching content by title:', error);
            throw error;
        }
    }

    async findByGenres(genres: string[]): Promise<Content[]> {
        try {
            return await this.repository.find({
                where: {
                    genres: In(genres),
                },
            });
        } catch (error) {
            logger.error('Error finding content by genres:', error);
            throw error;
        }
    }

    async findByRegion(region: string): Promise<Content[]> {
        try {
            return await this.repository.find({
                where: {
                    regions: Like(`%${region}%`),
                },
            });
        } catch (error) {
            logger.error('Error finding content by region:', error);
            throw error;
        }
    }

    async findByType(type: 'movie' | 'tv_show'): Promise<Content[]> {
        try {
            return await this.repository.find({
                where: {
                    type,
                },
            });
        } catch (error) {
            logger.error('Error finding content by type:', error);
            throw error;
        }
    }
} 