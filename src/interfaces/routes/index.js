import { Router } from 'express';

const router = Router();

// Route main
router.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running successfully!',
    status: 'success',
    timestamp: new Date().toISOString(),
  });
});

export default router;