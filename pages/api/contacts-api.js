import dbConnect from "../../db/dbConnect"
dbConnect()
import Contacts from "../../db/Contacts"
import User from '../../db/Users'

import { getSession } from 'next-auth/react'

export default async function handle(req, res) {
  const data = req.body
  const session = await getSession({ req })
  const { method } = req

  switch (method) {
    case "GET":
      res.status(400).json({
        error: true,
        message: 'GET operation not allowed in this route',
      })
      break
    case "POST":
      if (data.getContacts) {
        const myContacts = await Contacts.findOne({ uid: data.uid })
        if (!myContacts) res.status(400).json({ error: true, message: "No contacts" })
        else {
          const allContacts = myContacts.contacts_list
          res.status(200).json({ allContacts })
        }
      } else {
        const userData = await User.findOne({ email: data.email })
        if (userData) {

          const Person = await Contacts.findOne({ 'contacts_list.email': data.email, uid: data.uid })
          if (Person) res.status(400).json({ error: true, message: "This person already is your friend" })
          else {
            const NewPerson = await Contacts.updateOne({ uid: data.uid }, {
              uid: data.uid, email: data.user_email, $push: {
                contacts_list: {
                  id: userData._id,
                  email: data.email,
                  name: userData.name
                }
              },
            }, { upsert: true, new: true })
            const FrndsSideNewContactAdd = await Contacts.updateOne({ uid: userData._id }, {
              uid: userData._id, email: data.email, $push: {
                contacts_list: {
                  id: data.uid,
                  email: data.user_email,
                  name: data.name
                }
              },
            }, { upsert: true, new: true })

            if (NewPerson && FrndsSideNewContactAdd) res.status(200).json({UserSide: NewPerson, PartnerSide: FrndsSideNewContactAdd})
            else res.status(400).json({ error: true, message: "Unable to add the person to your contacts" })
          }
        } else {
          res.status(400).json({ error: true, message: "The person doesn't exist" })
        }
      }
      break
    default:
      res.status(400).json({
        error: true,
        message: 'unknown request',
      })
  }
}
