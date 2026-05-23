const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

function ensureDirAndFile(filePath) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
  }
}

function readData(filePath) {
  ensureDirAndFile(filePath);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

function writeData(filePath, data) {
  ensureDirAndFile(filePath);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
  }
}

class LocalUserDoc {
  constructor(data) {
    this._id = data._id || Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async comparePassword(plain) {
    return bcrypt.compare(plain, this.password);
  }

  toObject() {
    return {
      _id: this._id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

const LocalUser = {
  async findOne({ email }) {
    const users = readData(USERS_FILE);
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? new LocalUserDoc(found) : null;
  },

  async create(data) {
    const users = readData(USERS_FILE);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = {
      _id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      email: data.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    writeData(USERS_FILE, users);
    return new LocalUserDoc(newUser);
  }
};

class LocalProjectDoc {
  constructor(data) {
    this._id = data._id || Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    this.userId = data.userId;
    this.title = data.title;
    this.description = data.description || '';
    this.category = data.category || 'Other';
    this.tags = data.tags || [];
    this.image = data.image || '';
    this.url = data.url || '';
    this.featured = !!data.featured;
    this.views = Number(data.views) || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      category: this.category,
      tags: this.tags,
      image: this.image,
      url: this.url,
      featured: this.featured,
      views: this.views,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

const LocalProject = {
  find(filter = {}) {
    const projects = readData(PROJECTS_FILE);
    let filtered = projects.map(p => new LocalProjectDoc(p));
    if (filter && typeof filter === 'object') {
      filtered = filtered.filter(p => {
        for (const key in filter) {
          if (p[key] !== filter[key]) return false;
        }
        return true;
      });
    }
    const query = {
      results: filtered,
      sort(criteria) {
        const key = Object.keys(criteria)[0];
        const dir = criteria[key]; // -1 or 1
        this.results.sort((a, b) => {
          const valA = a[key] || '';
          const valB = b[key] || '';
          if (valA < valB) return -1 * dir;
          if (valA > valB) return 1 * dir;
          return 0;
        });
        return this;
      },
      then(resolve, reject) {
        resolve(this.results);
      }
    };
    return query;
  },

  async findById(id) {
    const projects = readData(PROJECTS_FILE);
    const found = projects.find(p => p._id === id);
    return found ? new LocalProjectDoc(found) : null;
  },

  async create(data) {
    const projects = readData(PROJECTS_FILE);
    const newProject = new LocalProjectDoc(data);
    projects.push(newProject.toObject());
    writeData(PROJECTS_FILE, projects);
    return newProject;
  },

  async findByIdAndUpdate(id, data, options) {
    const projects = readData(PROJECTS_FILE);
    const idx = projects.findIndex(p => p._id === id);
    if (idx === -1) return null;
    projects[idx] = {
      ...projects[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    writeData(PROJECTS_FILE, projects);
    return new LocalProjectDoc(projects[idx]);
  },

  async findByIdAndDelete(id) {
    const projects = readData(PROJECTS_FILE);
    const idx = projects.findIndex(p => p._id === id);
    if (idx === -1) return null;
    const deleted = projects.splice(idx, 1)[0];
    writeData(PROJECTS_FILE, projects);
    return new LocalProjectDoc(deleted);
  }
};

module.exports = {
  User: LocalUser,
  Project: LocalProject
};
