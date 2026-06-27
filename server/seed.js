/**
 * seed.js
 * Run once to populate the database with realistic Sri Lankan washroom data.
 * Safe to run multiple times — checks for existing data before inserting.
 * 
 * Local:  node seed.js
 * Render: node seed.js (after setting DATABASE_URL to Render external URL)
 */

require('dotenv').config();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const washrooms = [
  // Colombo
  {
    name: 'Galle Face Green Public Washroom',
    address: 'Galle Face Green, Colombo 03',
    latitude: 6.9167,
    longitude: 79.8447,
    description: 'Public washroom on the main beachfront promenade. Generally clean during daytime hours.',
  },
  {
    name: 'Viharamahadevi Park Washroom',
    address: 'Viharamahadevi Park, Cinnamon Gardens, Colombo 07',
    latitude: 6.9108,
    longitude: 79.8607,
    description: 'Located inside the largest park in Colombo. Free to use. Maintained by the city council.',
  },
  {
    name: 'Colombo Fort Railway Station Washroom',
    address: 'Colombo Fort Railway Station, Pettah, Colombo 01',
    latitude: 6.9344,
    longitude: 79.8428,
    description: 'Inside the main railway station. Busy during peak hours. Small fee may apply.',
  },
  {
    name: 'Liberty Plaza Mall Washroom',
    address: 'Liberty Plaza, R A De Mel Mawatha, Colombo 03',
    latitude: 6.9056,
    longitude: 79.8567,
    description: 'Clean mall washroom on the second floor. Free for shoppers.',
  },
  {
    name: 'Majestic City Mall Washroom',
    address: 'Majestic City, Station Road, Bambalapitiya, Colombo 04',
    latitude: 6.8942,
    longitude: 79.8567,
    description: 'Well maintained washroom inside Majestic City shopping complex.',
  },
  {
    name: 'One Galle Face Mall Washroom',
    address: 'One Galle Face Mall, Chittampalam A Gardiner Mawatha, Colombo 02',
    latitude: 6.9225,
    longitude: 79.8436,
    description: 'Premium washroom facilities in the newest mall in Colombo. Spotless and modern.',
  },
  {
    name: 'Gangaramaya Temple Washroom',
    address: 'Gangaramaya Temple, Sri Jinarathana Road, Colombo 02',
    latitude: 6.9169,
    longitude: 79.8522,
    description: 'Washroom available for temple visitors. Respectful behaviour expected.',
  },
  {
    name: 'National Museum Colombo Washroom',
    address: 'National Museum, Sir Marcus Fernando Mawatha, Colombo 07',
    latitude: 6.9103,
    longitude: 79.8612,
    description: 'Clean washroom inside the museum grounds. Available during opening hours only.',
  },
  {
    name: 'Pettah Market Public Washroom',
    address: 'Main Street, Pettah, Colombo 11',
    latitude: 6.9366,
    longitude: 79.8519,
    description: 'Public washroom in the heart of the Pettah market area. Can get busy on weekends.',
  },
  {
    name: 'Independence Square Washroom',
    address: 'Independence Square, Independence Avenue, Colombo 07',
    latitude: 6.9057,
    longitude: 79.8636,
    description: 'Clean public washroom at the historic Independence Square. Free to use.',
  },
  {
    name: 'Crescat Boulevard Washroom',
    address: 'Crescat Boulevard, Galle Road, Colombo 03',
    latitude: 6.9031,
    longitude: 79.8533,
    description: 'Upscale washroom facilities inside Crescat mall. Well maintained.',
  },
  {
    name: 'Dehiwala Zoo Washroom',
    address: 'Dehiwala Zoological Gardens, Anagarika Dharmapala Mawatha, Dehiwala',
    latitude: 6.8528,
    longitude: 79.8656,
    description: 'Multiple washroom blocks inside the zoo. Available during zoo operating hours.',
  },
  {
    name: 'Mount Lavinia Beach Washroom',
    address: 'Mount Lavinia Beach, Hotel Road, Mount Lavinia',
    latitude: 6.8378,
    longitude: 79.8675,
    description: 'Beach washroom near the main hotel area. Small fee charged.',
  },
  {
    name: 'Borella Public Market Washroom',
    address: 'Borella Market, Baseline Road, Colombo 08',
    latitude: 6.9178,
    longitude: 79.8769,
    description: 'Public washroom attached to Borella market. Free to use.',
  },
  {
    name: 'Lotus Tower Visitor Washroom',
    address: 'Colombo Lotus Tower, Bauddhaloka Mawatha, Colombo 07',
    latitude: 6.9214,
    longitude: 79.8617,
    description: 'Modern washroom facilities inside the Lotus Tower visitor complex.',
  },
  // Kandy
  {
    name: 'Kandy Lake Public Washroom',
    address: 'Kandy Lake, Kandy 20000',
    latitude: 7.2931,
    longitude: 80.6414,
    description: 'Public washroom beside the scenic Kandy Lake. Free to use.',
  },
  {
    name: 'Temple of the Tooth Washroom',
    address: 'Sri Dalada Maligawa, Kandy 20000',
    latitude: 7.2936,
    longitude: 80.6413,
    description: 'Washroom available for temple visitors. Smart casual dress required to enter.',
  },
  {
    name: 'Kandy City Centre Mall Washroom',
    address: 'Kandy City Centre, Dalada Veediya, Kandy 20000',
    latitude: 7.2942,
    longitude: 80.6356,
    description: 'Clean air-conditioned washroom on the second floor of KCC mall.',
  },
  // Galle
  {
    name: 'Galle Fort Public Washroom',
    address: 'Galle Fort, Church Street, Galle 80000',
    latitude: 6.0269,
    longitude: 80.2167,
    description: 'Public washroom inside the historic Dutch fort. Free to use. Well maintained for tourists.',
  },
  {
    name: 'Galle Bus Station Washroom',
    address: 'Galle Central Bus Station, Galle 80000',
    latitude: 6.0328,
    longitude: 80.2170,
    description: 'Washroom at the main bus station. Small fee may apply during peak hours.',
  },
];

async function seed() {
  try {
    console.log('Starting seed...');

    // Find a user to attach washrooms to — use the first user in the database
    const userResult = await pool.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.error('No users found. Please register at least one account first, then run seed again.');
      process.exit(1);
    }

    const userId = userResult.rows[0].id;
    console.log(`Seeding washrooms as user id ${userId}...`);

    let inserted = 0;
    let skipped = 0;

    for (const w of washrooms) {
      // Check if a washroom with this name already exists — skip if so
      const exists = await pool.query(
        'SELECT id FROM washrooms WHERE name = $1',
        [w.name]
      );

      if (exists.rows.length > 0) {
        console.log(`Skipped (already exists): ${w.name}`);
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO washrooms (name, address, latitude, longitude, description, added_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [w.name, w.address, w.latitude, w.longitude, w.description, userId]
      );

      console.log(`Inserted: ${w.name}`);
      inserted++;
    }

    console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();