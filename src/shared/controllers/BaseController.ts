import { Request, Response } from 'express';
import { BaseService } from '../services/BaseService';
import { BaseEntity } from '../entities/BaseEntity';
import logger from '../utils/logger';

export abstract class BaseController<T extends BaseEntity> {
    constructor(protected service: BaseService<T>) { }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const items = await this.service.findAll();
            res.json(items);
        } catch (error) {
            logger.error('Error in getAll:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const item = await this.service.findById(req.params.id);
            if (!item) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(item);
        } catch (error) {
            logger.error('Error in getById:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const item = await this.service.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            logger.error('Error in create:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const item = await this.service.update(req.params.id, req.body);
            if (!item) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(item);
        } catch (error) {
            logger.error('Error in update:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const success = await this.service.delete(req.params.id);
            if (!success) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            logger.error('Error in delete:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
} 