import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController';
import { Content } from '../entities/Content';
import { ContentService } from '../services/ContentService';
import logger from '../../shared/utils/logger';

export class ContentController extends BaseController<Content> {
    constructor() {
        super(new ContentService());
    }

    async searchByTitle(req: Request, res: Response): Promise<void> {
        try {
            const { title } = req.query;
            if (!title || typeof title !== 'string') {
                res.status(400).json({ error: 'Title query parameter is required' });
                return;
            }

            const content = await (this.service as ContentService).searchByTitle(title);
            res.json(content);
        } catch (error) {
            logger.error('Error in searchByTitle:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async findByGenres(req: Request, res: Response): Promise<void> {
        try {
            const { genres } = req.query;
            if (!genres || !Array.isArray(genres)) {
                res.status(400).json({ error: 'Genres query parameter must be an array' });
                return;
            }

            const content = await (this.service as ContentService).findByGenres(genres);
            res.json(content);
        } catch (error) {
            logger.error('Error in findByGenres:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async findByRegion(req: Request, res: Response): Promise<void> {
        try {
            const { region } = req.query;
            if (!region || typeof region !== 'string') {
                res.status(400).json({ error: 'Region query parameter is required' });
                return;
            }

            const content = await (this.service as ContentService).findByRegion(region);
            res.json(content);
        } catch (error) {
            logger.error('Error in findByRegion:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async findByType(req: Request, res: Response): Promise<void> {
        try {
            const { type } = req.query;
            if (!type || !['movie', 'tv_show'].includes(type as string)) {
                res.status(400).json({ error: 'Valid type query parameter is required (movie or tv_show)' });
                return;
            }

            const content = await (this.service as ContentService).findByType(type as 'movie' | 'tv_show');
            res.json(content);
        } catch (error) {
            logger.error('Error in findByType:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
} 