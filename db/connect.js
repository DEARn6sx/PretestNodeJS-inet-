const mongoose = require('mongoose')
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,{
  user: DB_USER,
  pass: DB_PASS
}).then(() => {
  console.log('DB connect!!!');
}).catch(err => {
  console.log('DB connect fail !!!');
})