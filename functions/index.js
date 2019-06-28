const functions = require('firebase-functions');
const admin = require('firebase-admin');
const register = require('./register');
const login = require('./login');
const auth = require('./auth');
const logout = require('./logout');
admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

exports.register = functions.region('europe-west1').https.onRequest((req,res)=>{
  register.handler(req,res,db);
});
exports.login = functions.region('europe-west1').https.onRequest((req,res)=>{
  login.handler(req,res,db);
});
exports.auth= functions.region('europe-west1').https.onRequest((req,res)=>{
  auth.handler(req,res,db);
});
exports.logout = functions.region('europe-west1').https.onRequest((req,res)=>{
  logout.handler(req,res,db);
});
exports.countTodo = functions.region('europe-west1').firestore.document('todolist/{todolistId}').onCreate(async(snapshot,context)=>{
  try{
    const value = await db.collection('counter').doc('todolist').get();
    let count = value.data().counter + 1;
    await db.collection('counter').doc('todolist').update({counter:count});
  }catch(err){
    console.log(err)
  }
});
exports.countUsers = functions.region('europe-west1').firestore.document('users/{userId}').onCreate(async(snapshot,context)=>{
  try{
    const value = await db.collection('counter').doc('users').get();
    let count = value.data().counter + 1;
    await db.collection('counter').doc('users').update({counter:count});
  }catch(err){
    console.log(err)
  }
});
exports.onDeleteTodo = functions.region('europe-west1').firestore.document('todolist/{todolistId}').onDelete(async(snapshot,context)=>{
  try {
    const value = await db.collection('counter').doc('todolist').get();
    const count = value.data().counter - 1;
    await db.collection('counter').doc('todolist').update({counter:count});
  } catch (err) {
    console.log(err);
  }
});
exports.onDeleteUsers = functions.region('europe-west1').firestore.document('users/{userId}').onDelete(async(snapshot,context)=>{
  try{
    const value = await db.collection('counter').doc('users').get();
    let count = value.data().counter - 1;
    await db.collection('counter').doc('users').update({counter:count});
  }catch(err){
    console.log(err)
  }
});