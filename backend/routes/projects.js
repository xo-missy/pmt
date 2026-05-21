const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authenticate = require('../middleware/authenticate');

// GET /projects — public, anyone can view
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    // Return id as a string field alongside _id so the frontend works with both
    const formatted = projects.map((p) => ({
      ...p.toObject(),
      id: p._id.toString(),
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// POST /projects — protected
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, category, tags, image, url } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const project = await Project.create({ title, description, category, tags, image, url });
    res.status(201).json({ ...project.toObject(), id: project._id.toString() });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// PUT /projects/:id — protected
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, description, category, tags, image, url } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, category, tags, image, url },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ error: 'Project not found.' });

    res.json({ ...project.toObject(), id: project._id.toString() });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /projects/:id — protected
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;
