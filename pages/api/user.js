import dbConnect from '../../db/dbConnect'
dbConnect()
import User from '../../db/Users'
import { hashPassword } from '../../components/Hash'
import Contacts from "../../db/Contacts"
export default async function handle(req, res) {
  const data = req.body
  const { method } = req

  switch (method) {
    case 'GET':
      res.status(400).json({
        error: true,
        message: 'GET operation not allowed in this route',
      })
      break
    case 'POST':
      if (data.signin) {
        const userData = await User.findOne({
          email: data.email,
        })
        if (userData)
          res.status(200).json({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            password: userData.password,
          })
        else {
          res.status(400).json({
            error: true,
            message: 'No account found',
          })
        }
      }
      if (data.signup) {
        const userData = await User.findOne({
          email: data.email,
        })
        if (userData)
          res.status(400).json({ error: true, message: 'User does already exists' })
        else {
          const hashedPass = await hashPassword(data.password)
          const newUserData = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPass,
          })
          if (newUserData) {
            res.status(200).json({
              id: newUserData._id,
              name: newUserData.name,
              email: newUserData.email,
              password: newUserData.password,
            })
          } else {
            res.status(400).json({ error: true, message: 'Something went wrong' })
          }
        }
      }
      if (data.getUserInfo) {
        if( data.id.length != 24) res.status(400).json({ error: true, message: "Inavlid id given" })
        const userInfo = await User.findById(data.id)
        if (userInfo) {
          if (data.isFriendCheck) {
            const Person = await Contacts.findOne({ 'contacts_list.id': data.id, uid: data.uid })
            if (Person) res.status(200).json(userInfo)
            else res.status(400).json({ error: true, message: "This person already is not your friend" })
          } 
          else res.status(200).json(userInfo)
        }
        else res.status(400).json({ error: true, message: "User doesn't exists" })
      }
      if (!data.signup && !data.signin && !data.getUserInfo) res.status(400).json({ error: true, message: 'Not valid POST request' })
      break
    default:
      res.status(400).json({
        error: true,
        message: 'Unknown request',
      })
  }
}
