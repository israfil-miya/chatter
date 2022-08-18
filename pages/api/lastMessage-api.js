import dbConnect from "../../db/dbConnect"
dbConnect()
import Contacts from "../../db/Contacts"
import User from '../../db/Users'
import Chats from '../../db/Chats'

import { getSession } from 'next-auth/react'

const fetchMessageData = (AllMessagesArr) => {

    return (
        AllMessagesArr.sort((x, y) => {
            return new Date(x.updatedAt) < new Date(y.updatedAt) ? 1 : -1
        })
    ).reverse()
}

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

            const lastTwoMessage = []


            const MyChatDoc = await Chats.findOne({ uid: data.uid, 'chats_list.partnerId': data.partnerId })
            if (MyChatDoc) {
                 const chatsArray = MyChatDoc.chats_list
                 const onlyPartnersMessages = chatsArray.filter(x => x.partnerId == data.partnerId)
                const lastMessage = onlyPartnersMessages[onlyPartnersMessages.length - 1]
                lastTwoMessage.push(lastMessage)
                
            }

            const PartnerChatDoc = await Chats.findOne({ uid: data.partnerId, 'chats_list.partnerId': data.uid })
            if (PartnerChatDoc) {
                const chatsArray = PartnerChatDoc.chats_list
                const onlyPartnersMessages = chatsArray.filter(x => x.partnerId == data.uid)
                const lastMessage = onlyPartnersMessages[onlyPartnersMessages.length - 1]
                lastTwoMessage.push(lastMessage)
            }
            console.log(fetchMessageData(lastTwoMessage)[fetchMessageData(lastTwoMessage).length - 1])
            res.status(200).json(fetchMessageData(lastTwoMessage)[fetchMessageData(lastTwoMessage).length - 1])





            break
        default:
            res.status(400).json({
                error: true,
                message: 'unknown request',
            })
            break
    }
}