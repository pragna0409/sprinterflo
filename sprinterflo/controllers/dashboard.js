const database = require('./db');

const db = database.db();

exports.waterCounter() = (req, res) => {
    // db.query('SELECT * from daily_logs');
}

// New function for mood and flow level
exports.moodFlowCounter() = (req, res) => {
   // try {
   
        //const db = await database;
        //const [results] = await db.execute(
            //'SELECT mood, flow_level FROM daily_logs WHERE user_id = ? AND log_date = ?',
          //  [req.user.id, req.query.date]
        //);
        //res.json({
        //    mood: results[0]?.mood || 'neutral',
      //      flow_level: results[0]?.flow_level || 'none'
        }
    //} catch (err) {
        //console.error(err);
      //  res.status(500).json({ error: 'Database error' });

