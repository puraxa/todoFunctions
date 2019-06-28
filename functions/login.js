const cors = require('cors')({
  origin: true
});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.handler = (req, res, db) => {
  cors(req, res, async () => {
    try {
      if (req.method != 'POST') {
        res.status(400).send({
          message: "Bad request"
        });
      } else {
        const data = JSON.parse(req.body);
        const doc = await db.collection('users').doc(data.email).get();
        if (!doc.exists) {
          res.status(401).send({
            message: 'No user found with email: ' + data.email
          });
        } else {
          const pwMatch = bcrypt.compare(data.password, doc.data().password);
          if (pwMatch) {
            const token = jwt.sign({
              id: doc.data().email
            }, 'edinedin');
            doc.ref.update({
              jwt: token
            });
            res.send({
              jwt: token
            });
          } else {
            res.status(401).send({
              message: 'Invalid password'
            });
          }
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  })
}