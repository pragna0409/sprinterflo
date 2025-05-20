const express= require('express');
const authController=require('../controllers/auth');
let dbPromise = require('../controllers/db');
const jwt = require('jsonwebtoken');
const router=express.Router();


// JWT authentication middleware
async function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
//   console.log(token);
  
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
}
  try {
      req.user = await jwt.verify(token, process.env.JWT_SECRET)
      next();
  } catch (error) {
      console.log(err);
      return res.sendStatus(403);
  }
}

// Get water intake for a date
router.get('/api/water', authenticateToken, async (req, res) => {


  const { date } = req.query;
  try {
    let db = await dbPromise;
    const [results] = await db.execute(
      'SELECT water_intake FROM daily_logs WHERE user_id = ? AND log_date = ?',
      [req.user.id, date]
    );
    res.json({ water_intake: results[0]?.water_intake || 0 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Set water intake for a date (async/await)
router.post('/api/water', authenticateToken, async (req, res) => {
    const { date, water_intake } = req.body;
    
    try {
            let db = await dbPromise;
        await db.execute(
            `INSERT INTO daily_logs (user_id, log_date, water_intake)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE water_intake = ?`,
            [req.user.id, date, water_intake, water_intake]
        );
        res.json({ success: true });
    } catch (err) {
      console.log(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/api/mood-flow', authenticateToken, async (req, res) => {
    const { date } = req.query;
    try {
        let db = await dbPromise;
        const [results] = await db.execute(
            'SELECT mood, flow_level FROM daily_logs WHERE user_id = ? AND log_date = ?',
            [req.user.id, date]
        );
        res.json({
            mood: results[0]?.mood || 'neutral',
            flow_level: results[0]?.flow_level || 'none'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'DB error' });
    }
});

// Set mood and flow level for a date
router.post('/api/mood-flow', authenticateToken, async (req, res) => {
    const { date, mood, flow_level } = req.body;
    try {
        let db = await dbPromise;
        await db.execute(
            `INSERT INTO daily_logs (user_id, log_date, mood, flow_level)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE mood = ?, flow_level = ?`,
            [req.user.id, date, mood, flow_level, mood, flow_level]
        );
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'DB error' });
    }
});

router.post('/register', authController.register)

router.post('/login', authController.login);

router.post('/popup', async (req, res) => {
    const userId = req.session.userId;
    const {
        age,
        menstrualLength,
        meanCycleLength,
        sport,
        weight,
        height,
        bodyType
    } = req.body;

    const db = await dbPromise;

    await db.execute('UPDATE users SET age=?, menstrual_length=?, mean_cycle_length=?, sport=?, weight=?, height=?, body_type=? WHERE id=?',
        [age, menstrualLength, meanCycleLength, sport, weight, height, bodyType, userId]),
                res.redirect('/');
    //     (err, result) => {
    //         if (err) {
    //             console.log(err);
    //             return res.send('Error saving data');
    //         }

    //     }
    // );
});

module.exports = router;