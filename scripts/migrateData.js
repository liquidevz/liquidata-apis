const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Team = require('../models/Team');
const Testimonial = require('../models/Testimonial');

dotenv.config();

const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

const formatPortfolioItem = (item) => {
  // If item is just a string (image path), create a full portfolio object
  if (typeof item === 'string') {
    return {
      title: 'Portfolio Item',
      category: 'Design',
      image: item,
      description: 'Portfolio item description',
      tags: ['design'],
      date: new Date()
    };
  }
  
  // If item has old format (img, subTitle), convert to new format
  if (item.img) {
    return {
      title: item.title || 'Portfolio Item',
      category: item.subTitle || 'Design',
      image: item.img,
      description: item.description || 'Portfolio item description',
      link: item.link || '#',
      tags: [item.subTitle || 'design'],
      date: new Date()
    };
  }
  
  return item;
};

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const dataDir = path.join(__dirname, '../../src/data');
    
    // Migrate Services
    const services = await readJsonFile(path.join(dataDir, 'services.json'));
    if (services) {
      await Service.deleteMany({});
      await Service.insertMany(services);
      console.log('Services migrated successfully');
    }

    // Migrate Team
    const team = await readJsonFile(path.join(dataDir, 'team.json'));
    if (team) {
      await Team.deleteMany({});
      await Team.insertMany(team);
      console.log('Team migrated successfully');
    }

    // Migrate Testimonials
    const testimonials = await readJsonFile(path.join(dataDir, 'testimonials.json'));
    if (testimonials) {
      await Testimonial.deleteMany({});
      await Testimonial.insertMany(testimonials);
      console.log('Testimonials migrated successfully');
    }

    // Migrate Portfolio
    const portfolioDir = path.join(dataDir, 'portfolios');
    const portfolioFiles = await fs.readdir(portfolioDir);
    let allPortfolioItems = [];

    for (const file of portfolioFiles) {
      if (file.endsWith('.json')) {
        const portfolioItems = await readJsonFile(path.join(portfolioDir, file));
        if (portfolioItems) {
          const formattedItems = portfolioItems.map(formatPortfolioItem);
          allPortfolioItems = [...allPortfolioItems, ...formattedItems];
        }
      }
    }

    if (allPortfolioItems.length > 0) {
      await Portfolio.deleteMany({});
      await Portfolio.insertMany(allPortfolioItems);
      console.log('Portfolio items migrated successfully');
    }

    console.log('All data migrated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData(); 