const cors = require('cors')({
  origin: true
});
const jwt = require('jsonwebtoken');

exports.handler = (req, res, db) => {
  cors(req, res, async () => {
    try {
      if (req.method != 'POST') {
        res.status(400).send({
          message: 'Bad request'
        });
      } else {
        const decoded = await jwt.verify(req.body.token, 'edinedin');
        let doc = await db.collection('users').doc(decoded.id).get();
        if (doc.data().jwt == req.body.token) {
          res.send({
            authorized: true
          });
        } else {
          res.status(401).send({
            authorized: false
          });
        }
      }
    } catch (err) {
      res.status(500).send({
        err
      });
    }
  })
}