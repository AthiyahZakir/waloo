/**
 * seed.js
 * Populates the database with Sri Lankan washroom data.
 * Includes tags, fake reviews (1-10 per washroom), and 2 near Dehiwela
 * with pre-seeded 1-star reviews to demonstrate auto-deletion feature.
 *
 * Local:  node seed.js
 * Render: $env:DATABASE_URL="your_render_url" then node seed.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')
    ? { rejectUnauthorized: false }
    : false,
});

const washrooms = [
  // Colombo (28)
  { name: 'Galle Face Green Public Washroom', address: 'Galle Face Green, Colombo 03', latitude: 6.9167, longitude: 79.8447, description: 'Public washroom on the main beachfront promenade. Generally clean during daytime.', tags: ['wheelchair', 'open_24h'] },
  { name: 'Viharamahadevi Park Washroom', address: 'Viharamahadevi Park, Cinnamon Gardens, Colombo 07', latitude: 6.9108, longitude: 79.8607, description: 'Located inside the largest park in Colombo. Free to use.', tags: ['wheelchair', 'baby_changing'] },
  { name: 'Colombo Fort Railway Station Washroom', address: 'Colombo Fort Railway Station, Pettah, Colombo 01', latitude: 6.9344, longitude: 79.8428, description: 'Inside the main railway station. Busy during peak hours.', tags: ['paid', 'open_24h'] },
  { name: 'Liberty Plaza Mall Washroom', address: 'Liberty Plaza, R A De Mel Mawatha, Colombo 03', latitude: 6.9056, longitude: 79.8567, description: 'Clean mall washroom on the second floor. Free for shoppers.', tags: ['wheelchair', 'baby_changing'] },
  { name: 'Majestic City Mall Washroom', address: 'Majestic City, Station Road, Bambalapitiya, Colombo 04', latitude: 6.8942, longitude: 79.8567, description: 'Well maintained washroom inside Majestic City shopping complex.', tags: ['wheelchair'] },
  { name: 'One Galle Face Mall Washroom', address: 'One Galle Face Mall, Chittampalam A Gardiner Mawatha, Colombo 02', latitude: 6.9225, longitude: 79.8436, description: 'Premium washroom in the newest mall in Colombo. Spotless and modern.', tags: ['wheelchair', 'baby_changing', 'shower'] },
  { name: 'Gangaramaya Temple Washroom', address: 'Gangaramaya Temple, Sri Jinarathana Road, Colombo 02', latitude: 6.9169, longitude: 79.8522, description: 'Washroom available for temple visitors. Respectful behaviour expected.', tags: ['key_required'] },
  { name: 'National Museum Colombo Washroom', address: 'National Museum, Sir Marcus Fernando Mawatha, Colombo 07', latitude: 6.9103, longitude: 79.8612, description: 'Clean washroom inside the museum grounds. Available during opening hours only.', tags: ['wheelchair'] },
  { name: 'Pettah Market Public Washroom', address: 'Main Street, Pettah, Colombo 11', latitude: 6.9366, longitude: 79.8519, description: 'Public washroom in the heart of Pettah market. Busy on weekends.', tags: ['paid', 'open_24h'] },
  { name: 'Independence Square Washroom', address: 'Independence Square, Independence Avenue, Colombo 07', latitude: 6.9057, longitude: 79.8636, description: 'Clean public washroom at the historic Independence Square. Free to use.', tags: ['wheelchair', 'open_24h'] },
  { name: 'Crescat Boulevard Washroom', address: 'Crescat Boulevard, Galle Road, Colombo 03', latitude: 6.9031, longitude: 79.8533, description: 'Upscale washroom facilities inside Crescat mall. Well maintained.', tags: ['wheelchair', 'baby_changing'] },
  { name: 'Dehiwala Zoo Washroom', address: 'Dehiwala Zoological Gardens, Anagarika Dharmapala Mawatha, Dehiwala', latitude: 6.8528, longitude: 79.8656, description: 'Multiple washroom blocks inside the zoo. Available during zoo hours.', tags: ['baby_changing', 'wheelchair'] },
  { name: 'Mount Lavinia Beach Washroom', address: 'Mount Lavinia Beach, Hotel Road, Mount Lavinia', latitude: 6.8378, longitude: 79.8675, description: 'Beach washroom near the main hotel area. Small fee charged.', tags: ['paid', 'shower'] },
  { name: 'Borella Public Market Washroom', address: 'Borella Market, Baseline Road, Colombo 08', latitude: 6.9178, longitude: 79.8769, description: 'Public washroom attached to Borella market. Free to use.', tags: [] },
  { name: 'Lotus Tower Visitor Washroom', address: 'Colombo Lotus Tower, Bauddhaloka Mawatha, Colombo 07', latitude: 6.9214, longitude: 79.8617, description: 'Modern washroom facilities inside the Lotus Tower visitor complex.', tags: ['wheelchair', 'baby_changing'] },
  { name: 'Dutch Hospital Colombo Washroom', address: 'Dutch Hospital Shopping Precinct, Hospital Street, Colombo 01', latitude: 6.9353, longitude: 79.8432, description: 'Located inside the historic Dutch Hospital dining area. Clean and accessible.', tags: ['wheelchair'] },
  { name: 'Arcade Independence Square Washroom', address: 'Arcade Independence Square, Independence Avenue, Colombo 07', latitude: 6.9049, longitude: 79.8628, description: 'Modern facilities inside the Arcade shopping area. Free for visitors.', tags: ['wheelchair', 'baby_changing'] },
  { name: 'Kollupitiya Railway Station Washroom', address: 'Kollupitiya Railway Station, Galle Road, Colombo 03', latitude: 6.9006, longitude: 79.8533, description: 'Small but functional washroom at Kollupitiya station. Small fee applies.', tags: ['paid'] },
  { name: 'Bambalapitiya Beach Washroom', address: 'Bambalapitiya Beach, Galle Road, Colombo 04', latitude: 6.8894, longitude: 79.8536, description: 'Public beach washroom. Busy on weekends. Maintained by the city.', tags: ['open_24h'] },
  { name: 'Nugegoda Market Washroom', address: 'Nugegoda Market, High Level Road, Nugegoda', latitude: 6.8728, longitude: 79.8897, description: 'Public washroom at the main Nugegoda market junction.', tags: ['paid'] },
  { name: 'Wellawatte Beach Public Washroom', address: 'Wellawatte Beach, Galle Road, Colombo 06', latitude: 6.8811, longitude: 79.8542, description: 'Seaside public washroom. Basic but functional. Free to use.', tags: ['open_24h'] },
  { name: 'Rajagiriya Park Washroom', address: 'Rajagiriya Park, Rajagiriya, Colombo', latitude: 6.9083, longitude: 79.9006, description: 'Quiet neighbourhood park washroom. Rarely crowded.', tags: ['wheelchair'] },
  { name: 'Kolonnawa Town Washroom', address: 'Kolonnawa Town Centre, Kolonnawa', latitude: 6.9178, longitude: 79.9278, description: 'Municipal washroom in the Kolonnawa town area. Free to use.', tags: [] },
  { name: 'Orion City Food Court Washroom', address: 'Orion City, Dr Danister De Silva Mawatha, Colombo 09', latitude: 6.9286, longitude: 79.8669, description: 'Modern washroom on the food court level. Clean and well maintained.', tags: ['wheelchair', 'baby_changing'] },
  { name: 'Marine Drive Public Washroom', address: 'Marine Drive, Colombo 15', latitude: 6.9453, longitude: 79.8397, description: 'Seafront public washroom on Marine Drive. Open most hours.', tags: ['open_24h'] },
  { name: 'Kelaniya Temple Washroom', address: 'Kelaniya Raja Maha Viharaya, Kelaniya', latitude: 6.9544, longitude: 79.9219, description: 'Washroom for temple visitors. Clean and well kept. Free to use.', tags: ['wheelchair', 'key_required'] },
  { name: 'Maharagama Town Washroom', address: 'Maharagama Town, High Level Road, Maharagama', latitude: 6.8475, longitude: 79.9264, description: 'Public washroom near the Maharagama bus stand.', tags: ['paid'] },
  { name: 'Battaramulla Town Washroom', address: 'Battaramulla Town Centre, Battaramulla', latitude: 6.9053, longitude: 79.9197, description: 'Newly renovated public washroom in the Battaramulla commercial area.', tags: ['wheelchair', 'baby_changing'] },

  // Nuwara Eliya (20)
  { name: 'Seetha Devi Tea Stop Washroom', address: '14 Haddon Hill Road, Nuwara Eliya 22200', latitude: 6.9701, longitude: 80.7731, description: 'Small washroom at a family-run tea stop. Ask the owner for the key.', tags: ['key_required'] },
  { name: 'Pinkberry Cottage Washroom', address: 'Pinkberry Cottage, Gregory Lake Road, Nuwara Eliya', latitude: 6.9683, longitude: 80.7758, description: 'Guest washroom at a quiet lakeside cottage. Very clean, limited hours.', tags: ['key_required', 'paid'] },
  { name: 'Cloudview Rest Stop Washroom', address: 'Cloudview Rest, Unique View Road, Nuwara Eliya', latitude: 6.9724, longitude: 80.7812, description: 'Basic but clean washroom at a roadside rest stop with a great hill view.', tags: [] },
  { name: 'Misty Pines Bakery Washroom', address: 'Misty Pines Bakery, New Bazaar Street, Nuwara Eliya', latitude: 6.9698, longitude: 80.7745, description: 'Washroom for bakery customers. Buy something and they will let you use it.', tags: [] },
  { name: 'Gregory Lake Park Washroom', address: 'Gregory Lake, Nuwara Eliya 22200', latitude: 6.9672, longitude: 80.7769, description: 'Public washroom by the lake park entrance. Maintained by the municipal council.', tags: ['wheelchair', 'open_24h'] },
  { name: 'Strawberry Fields Cafe Washroom', address: 'Strawberry Fields Cafe, Racecourse Road, Nuwara Eliya', latitude: 6.9712, longitude: 80.7801, description: 'Clean washroom inside this charming hilltop cafe. For customers only.', tags: ['baby_changing'] },
  { name: 'Hilltop Petrol Station Washroom', address: 'Hilltop Filling Station, Kandy Road, Nuwara Eliya', latitude: 6.9689, longitude: 80.7822, description: 'Standard petrol station washroom. Open long hours, always unlocked.', tags: ['open_24h'] },
  { name: 'Nuwara Eliya Post Office Washroom', address: 'Nuwara Eliya Post Office, Park Road, Nuwara Eliya', latitude: 6.9694, longitude: 80.7761, description: 'Small government washroom attached to the post office. Free during office hours.', tags: [] },
  { name: 'Moonstone Guesthouse Washroom', address: 'Moonstone Guesthouse, St Andrews Drive, Nuwara Eliya', latitude: 6.9741, longitude: 80.7788, description: 'Guesthouse washroom available to travellers stopping by. Small donation appreciated.', tags: ['paid', 'shower'] },
  { name: 'Blue Mist Flower Shop Washroom', address: 'Blue Mist Flowers, Grand Hotel Road, Nuwara Eliya', latitude: 6.9668, longitude: 80.7779, description: 'Tiny but spotless washroom behind a charming flower shop. Ask at the counter.', tags: ['key_required'] },
  { name: 'Fernside Tea Estate Washroom', address: 'Fernside Tea Estate, Kandapola Road, Nuwara Eliya', latitude: 6.9758, longitude: 80.7844, description: 'Washroom at the edge of a working tea estate. Available during tour hours.', tags: ['key_required'] },
  { name: 'Racecourse Public Washroom', address: 'Nuwara Eliya Racecourse, Racecourse Road, Nuwara Eliya', latitude: 6.9706, longitude: 80.7814, description: 'Public washroom at the famous racecourse grounds. Open year round.', tags: ['wheelchair', 'open_24h'] },
  { name: 'Central Market Nuwara Eliya Washroom', address: 'Nuwara Eliya Central Market, New Bazaar Street, Nuwara Eliya', latitude: 6.9695, longitude: 80.7752, description: 'Busy market washroom. Gets crowded on weekends but reasonably clean.', tags: ['paid'] },
  { name: 'Amber Hill Homestay Washroom', address: 'Amber Hill Homestay, Upper Lake Road, Nuwara Eliya', latitude: 6.9659, longitude: 80.7781, description: 'Welcoming homestay that lets passing travellers use their washroom. Very kind hosts.', tags: ['baby_changing'] },
  { name: 'Pidurutalagala Viewpoint Washroom', address: 'Pidurutalagala Viewpoint, Mountain Road, Nuwara Eliya', latitude: 6.9803, longitude: 80.7736, description: 'Simple outdoor washroom at the mountain viewpoint. Basic but available.', tags: [] },
  { name: 'Devon Falls Roadside Washroom', address: 'Devon Falls Viewpoint, Talawakele Road, near Nuwara Eliya', latitude: 6.9312, longitude: 80.6847, description: 'Roadside washroom near the Devon Falls viewpoint. Small fee applies.', tags: ['paid'] },
  { name: 'Ramboda Falls Rest Stop Washroom', address: 'Ramboda Falls, Ramboda Pass, near Nuwara Eliya', latitude: 7.0144, longitude: 80.7153, description: 'Rest stop washroom at the famous Ramboda Falls. Tourist-friendly and clean.', tags: ['wheelchair', 'paid'] },
  { name: 'Lakeside Inn Washroom', address: 'Lakeside Inn, Unique View Road, Nuwara Eliya', latitude: 6.9678, longitude: 80.7793, description: 'Inn washroom open to day visitors. Hot water available.', tags: ['shower', 'paid'] },
  { name: 'Victoria Park Washroom', address: 'Victoria Park, Park Road, Nuwara Eliya', latitude: 6.9688, longitude: 80.7742, description: 'Public washroom inside the beautiful Victoria Park. Free during park hours.', tags: ['wheelchair'] },
  { name: 'Sunnyside Corner Cafe Washroom', address: 'Sunnyside Corner, Lawson Street, Nuwara Eliya', latitude: 6.9703, longitude: 80.7762, description: 'Cozy cafe washroom. Order a tea or snack and it is yours to use.', tags: ['baby_changing'] },

  // Random Sri Lanka (10)
  { name: 'Kandy Lake Public Washroom', address: 'Kandy Lake, Kandy 20000', latitude: 7.2931, longitude: 80.6414, description: 'Public washroom beside the scenic Kandy Lake. Free to use.', tags: ['wheelchair', 'open_24h'] },
  { name: 'Temple of the Tooth Washroom', address: 'Sri Dalada Maligawa, Kandy 20000', latitude: 7.2936, longitude: 80.6413, description: 'Washroom available for temple visitors. Smart casual dress required.', tags: ['key_required'] },
  { name: 'Galle Fort Public Washroom', address: 'Galle Fort, Church Street, Galle 80000', latitude: 6.0269, longitude: 80.2167, description: 'Inside the historic Dutch fort. Free to use. Well maintained for tourists.', tags: ['wheelchair'] },
  { name: 'Galle Bus Station Washroom', address: 'Galle Central Bus Station, Galle 80000', latitude: 6.0328, longitude: 80.2170, description: 'Washroom at the main bus station. Small fee may apply during peak hours.', tags: ['paid', 'open_24h'] },
  { name: 'Sigiriya Rock Visitor Washroom', address: 'Sigiriya Rock Fortress, Sigiriya 21120', latitude: 7.9572, longitude: 80.7603, description: 'Clean washroom at the Sigiriya visitor entrance. Available during site hours.', tags: ['wheelchair', 'paid'] },
  { name: 'Dambulla Cave Temple Washroom', address: 'Dambulla Golden Temple, Dambulla 21100', latitude: 7.8558, longitude: 80.6492, description: 'Washroom at the entrance to the famous cave temple complex.', tags: ['wheelchair'] },
  { name: 'Mirissa Beach Public Washroom', address: 'Mirissa Beach, Mirissa 81740', latitude: 5.9489, longitude: 80.4714, description: 'Beach washroom near the main strip. Small fee during peak season.', tags: ['shower', 'paid'] },
  { name: 'Ella Railway Station Washroom', address: 'Ella Railway Station, Ella 90090', latitude: 6.8753, longitude: 81.0464, description: 'Small washroom at the famous Ella station. Basic but clean.', tags: [] },
  { name: 'Trincomalee Beach Washroom', address: 'Nilaveli Beach, Trincomalee 31000', latitude: 8.7036, longitude: 81.2167, description: 'Beach washroom on the east coast. Clean and free during daytime.', tags: ['shower', 'open_24h'] },
  { name: 'Jaffna Bus Stand Washroom', address: 'Jaffna Central Bus Station, Hospital Road, Jaffna 40000', latitude: 9.6615, longitude: 80.0255, description: 'Public washroom at the main Jaffna bus stand. Small fee applies.', tags: ['paid', 'open_24h'] },

  // Dehiwela demo washrooms — get 1 one-star review each, second comes live in viva
  { name: 'De Alwis Place Corner Washroom', address: 'De Alwis Place, Dehiwela', latitude: 6.8491, longitude: 79.8661, description: 'Small public washroom on the corner of De Alwis Place.', tags: [], demoDelete: true },
  { name: 'Dehiwela Junction Public Washroom', address: 'Dehiwela Junction, Galle Road, Dehiwela', latitude: 6.8502, longitude: 79.8648, description: 'Public washroom at the busy Dehiwela junction.', tags: [], demoDelete: true },
];

const positiveReviews = [
  { rating: 5, comment: 'Very clean and well maintained. Soap and water always available.' },
  { rating: 4, comment: 'Pretty good for a public washroom. Could use more paper towels.' },
  { rating: 5, comment: 'Surprisingly spotless! Great experience.' },
  { rating: 3, comment: 'Decent but gets busy during weekends. Queue can be long.' },
  { rating: 4, comment: 'Clean enough. Staff were helpful when I asked for directions.' },
  { rating: 5, comment: 'Best public washroom I have found in this area. Highly recommend.' },
  { rating: 3, comment: 'Functional but nothing special. Does the job.' },
  { rating: 4, comment: 'Good facilities, wheelchair ramp was easy to use.' },
  { rating: 5, comment: 'Clean, free, and easy to find. What more could you ask for?' },
  { rating: 4, comment: 'Well lit and clean. Happy to have found this.' },
  { rating: 3, comment: 'Average. Gets the job done but nothing impressive.' },
  { rating: 5, comment: 'Nicely maintained. Will definitely use again.' },
  { rating: 4, comment: 'Surprisingly good for this area. Recommended.' },
  { rating: 3, comment: 'It works. Nothing to complain about.' },
  { rating: 5, comment: 'Always clean when I visit. Great effort by the maintainers.' },
  { rating: 4, comment: 'Good enough. Soap dispenser was full which is a bonus.' },
  { rating: 2, comment: 'A bit smelly when I visited but may have been a bad day.' },
  { rating: 5, comment: 'Impressed by how clean this was. Keep it up!' },
  { rating: 3, comment: 'Okay washroom. Nothing special but it serves the purpose.' },
  { rating: 4, comment: 'Reliable option in this area. Always functional.' },
];

async function seed() {
  try {
    console.log('Starting seed...');

    const seedUsers = [
      { username: 'aravind_k', email: 'aravind.k@seeduser.waloo', password: 'seedpass123' },
      { username: 'priya_m', email: 'priya.m@seeduser.waloo', password: 'seedpass123' },
      { username: 'thisaru_j', email: 'thisaru.j@seeduser.waloo', password: 'seedpass123' },
      { username: 'kamala_r', email: 'kamala.r@seeduser.waloo', password: 'seedpass123' },
      { username: 'nimal_s', email: 'nimal.s@seeduser.waloo', password: 'seedpass123' },
      { username: 'dilani_w', email: 'dilani.w@seeduser.waloo', password: 'seedpass123' },
      { username: 'suresh_p', email: 'suresh.p@seeduser.waloo', password: 'seedpass123' },
      { username: 'amali_f', email: 'amali.f@seeduser.waloo', password: 'seedpass123' },
      { username: 'roshan_b', email: 'roshan.b@seeduser.waloo', password: 'seedpass123' },
      { username: 'sandya_t', email: 'sandya.t@seeduser.waloo', password: 'seedpass123' },
    ];

    const userIds = [];
    for (const u of seedUsers) {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (exists.rows.length > 0) {
        userIds.push(exists.rows[0].id);
        console.log('Seed user exists: ' + u.username);
      } else {
        const hashed = await bcrypt.hash(u.password, 10);
        const res = await pool.query(
          'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
          [u.username, u.email, hashed]
        );
        userIds.push(res.rows[0].id);
        console.log('Created seed user: ' + u.username);
      }
    }

    const ownerResult = await pool.query(
      "SELECT id FROM users WHERE email NOT LIKE '%@seeduser.waloo' ORDER BY id LIMIT 1"
    );
    if (ownerResult.rows.length === 0) {
      console.error('No real user found. Please register at least one account first.');
      process.exit(1);
    }
    const ownerId = ownerResult.rows[0].id;
    console.log('Seeding washrooms as user id ' + ownerId + '...');

    let inserted = 0;
    let skipped = 0;

    for (const w of washrooms) {
      const exists = await pool.query('SELECT id FROM washrooms WHERE name = $1', [w.name]);
      if (exists.rows.length > 0) {
        console.log('Skipped: ' + w.name);
        skipped++;
        continue;
      }

      const washroomRes = await pool.query(
        'INSERT INTO washrooms (name, address, latitude, longitude, description, added_by, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [w.name, w.address, w.latitude, w.longitude, w.description, ownerId, w.tags || []]
      );
      const washroomId = washroomRes.rows[0].id;

      if (w.demoDelete) {
        try {
          await pool.query(
            'INSERT INTO reviews (washroom_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)',
            [washroomId, userIds[0], 1, 'Absolutely disgusting. Would not recommend to anyone.']
          );
          console.log('Inserted demo washroom (1-star pre-loaded): ' + w.name);
        } catch (e) {
          console.log('Review already exists for: ' + w.name);
        }
      } else {
        const numReviews = 1 + Math.floor(Math.random() * 10);
        const shuffledUsers = [...userIds].sort(() => Math.random() - 0.5);
        const shuffledReviews = [...positiveReviews].sort(() => Math.random() - 0.5);
        let reviewsAdded = 0;

        for (let i = 0; i < numReviews && i < shuffledUsers.length; i++) {
          try {
            const review = shuffledReviews[i % shuffledReviews.length];
            await pool.query(
              'INSERT INTO reviews (washroom_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)',
              [washroomId, shuffledUsers[i], review.rating, review.comment]
            );
            reviewsAdded++;
          } catch (e) {}
        }
        console.log('Inserted: ' + w.name + ' (' + reviewsAdded + ' reviews)');
      }

      inserted++;
    }

    console.log('\nDone. ' + inserted + ' inserted, ' + skipped + ' skipped.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();