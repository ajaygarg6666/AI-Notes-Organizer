const express = require('express');
const {
  createFolder, getFolders, deleteFolder,
  createSubject, getSubjects, updateSubject, deleteSubject,
} = require('../controllers/subjectController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/folders', createFolder);
router.get('/folders', getFolders);
router.delete('/folders/:id', deleteFolder);

router.post('/', createSubject);
router.get('/', getSubjects);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;
