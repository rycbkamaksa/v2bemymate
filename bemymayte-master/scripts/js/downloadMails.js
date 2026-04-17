const mongoose = require('mongoose')
const fs = require('fs')

const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
)

const Email = mongoose.model('Email', emailSchema)

const downloadMails = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    const allMails = await Email.find({}, 'email').exec()
    const fd = fs.openSync('mails.txt', 'a+')
    fs.ftruncateSync(fd)
    allMails.forEach(({ email }) => {
      fs.appendFileSync(fd, email + '\n')
    })
  } catch (e) {
    throw e
  }
}

downloadMails()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log('Failed to load emails', err)
    process.exit(1)
  })
