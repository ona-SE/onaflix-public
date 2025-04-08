import { Router } from 'express';
import { ContentController } from '../controllers/ContentController';

const router = Router();
const controller = new ContentController();

// Base CRUD routes
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

// Catalog-specific routes
router.get('/search/title', (req, res) => controller.searchByTitle(req, res));
router.get('/search/genres', (req, res) => controller.findByGenres(req, res));
router.get('/search/region', (req, res) => controller.findByRegion(req, res));
router.get('/search/type', (req, res) => controller.findByType(req, res));

export default router; 