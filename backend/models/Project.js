const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Other' },
    tags: { type: [String], default: [] },
    image: { type: String, default: '' },
    url: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MongooseProject = mongoose.model('Project', projectSchema);

module.exports = new Proxy(MongooseProject, {
  get(target, prop) {
    if (global.useLocalDB) {
      return require('./localDb').Project[prop];
    }
    return target[prop];
  },
  construct(target, args) {
    if (global.useLocalDB) {
      const LocalProjectClass = require('./localDb').Project;
      return new LocalProjectClass(...args);
    }
    return new target(...args);
  }
});
