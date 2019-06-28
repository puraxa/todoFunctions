const cors = require('cors')({
  origin: true
});
const bcrypt = require('bcrypt');

exports.handler = (req, res, db) => {
  cors(req, res, async () => {
    try {
      if (req.method != 'POST') {
        res.status(400).send({
          message: 'Bad request!'
        });
      } else {
        let data = JSON.parse(req.body);
        const doc = await db.collection('users').doc(data.email).get();
        if (doc.exists) {
          res.status(400).send({
            message: 'Already in use'
          });
        } else {
          const pw = await bcrypt.hash(data.password, 8);
          await db.collection('users').doc(data.email).set({
            email: data.email,
            password: pw,
          });
          res.send({
            message: 'Succesfully registred!'
          });
        }
      }
    } catch (error) {
      res.status(500).send({
        message: error
      });
    }
  })
}