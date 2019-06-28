const cors = require('cors')({origin:true});
const jwt = require('jsonwebtoken');

exports.handler = (req, res, db) => {
  cors(req, res, async() =>{
    try {
      if(req.method != 'POST'){
        res.status(400).send({message:'Bad request!'});
      }else{
        const decoded = await jwt.verify(req.body.token, 'edinedin');
        console.log(decoded);
        db.collection('users').doc(decoded.id).update({jwt:null});
        res.status(200).send({message: 'Logged out!'});
      }
    } catch (err) {
      res.status(401).send({authorized:false});
    }
  })
}