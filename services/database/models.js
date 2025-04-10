const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// Initialize Sequelize with SQLite for simplicity in the demo environment
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),  // SQLite database file with absolute path
  logging: false
});

// Define models for streaming platform
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  preferences: {
    type: DataTypes.TEXT,
    defaultValue: '{}',
    get() {
      const rawValue = this.getDataValue('preferences');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('preferences', JSON.stringify(value));
    }
  },
  watchHistory: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('watchHistory');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('watchHistory', JSON.stringify(value));
    }
  }
});

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  duration: {
    type: DataTypes.INTEGER // in minutes
  },
  releaseYear: {
    type: DataTypes.INTEGER
  },
  genre: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('genre');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('genre', JSON.stringify(value));
    }
  },
  rating: {
    type: DataTypes.FLOAT
  },
  imageUrl: {
    type: DataTypes.STRING
  }
});

const Show = sequelize.define('Show', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  seasons: {
    type: DataTypes.INTEGER
  },
  episodes: {
    type: DataTypes.INTEGER
  },
  releaseYear: {
    type: DataTypes.INTEGER
  },
  genre: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('genre');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('genre', JSON.stringify(value));
    }
  },
  rating: {
    type: DataTypes.FLOAT
  },
  imageUrl: {
    type: DataTypes.STRING
  }
});

const Stream = sequelize.define('Stream', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  contentId: {
    type: DataTypes.UUID
  },
  contentType: {
    type: DataTypes.STRING,
    validate: {
      isIn: [['movie', 'show']]
    }
  },
  startTime: {
    type: DataTypes.DATE
  },
  duration: {
    type: DataTypes.INTEGER // in seconds
  },
  quality: {
    type: DataTypes.STRING
  },
  deviceType: {
    type: DataTypes.STRING
  }
});

const Recommendation = sequelize.define('Recommendation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  contentId: {
    type: DataTypes.UUID
  },
  contentType: {
    type: DataTypes.STRING,
    validate: {
      isIn: [['movie', 'show']]
    }
  },
  score: {
    type: DataTypes.FLOAT
  },
  reason: {
    type: DataTypes.STRING
  }
});

// Define relationships
User.hasMany(Stream, { foreignKey: 'userId' });
Stream.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Recommendation, { foreignKey: 'userId' });
Recommendation.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Movie,
  Show,
  Stream,
  Recommendation,
  sequelize
};