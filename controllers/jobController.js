const Job = require('../models/Job');

// POST /api/jobs - post a new job (login required)
async function createJob(req, res) {
  try {
    const { title, description, payRate, jobType, location, contactInfo } = req.body;

    if (!title || !description || !payRate) {
      return res.status(400).json({ message: 'Title, description and pay rate are required' });
    }

    const job = await Job.create({
      title,
      description,
      payRate,
      jobType,
      location,
      contactInfo,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Could not create job posting', error: error.message });
  }
}

// GET /api/jobs - list all open jobs (public)
async function getJobs(req, res) {
  try {
    const filter = { isOpen: true };
    if (req.query.jobType) {
      filter.jobType = req.query.jobType;
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch jobs', error: error.message });
  }
}

// GET /api/jobs/:id - get one job's details (public)
async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch job', error: error.message });
  }
}

// PUT /api/jobs/:id - update a job (only the person who posted it)
async function updateJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own job postings' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Could not update job', error: error.message });
  }
}

// DELETE /api/jobs/:id - delete a job (only the person who posted it)
async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own job postings' });
    }

    await job.deleteOne();
    res.json({ message: 'Job posting deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete job', error: error.message });
  }
}

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };