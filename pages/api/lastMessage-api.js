import dbConnect from "../../db/dbConnect"
dbConnect()
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
            let LastMessageList = []

            const api_res = await fetch(`${process.env.BASE_URL}/api/contacts-api`, {
                method: 'POST',
                body: JSON.stringify({ getContacts: true, uid: data.uid }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const resData = await api_res.json()
            if (resData.error) {
                LastMessageList = []
            } else {
                let values = await Promise.all(resData.allContacts.map(async contact => {
                    let myPartnerId = contact.id
                    const lastTwoMessage = []

                    const MyChatDoc = await Chats.findOne({ uid: data.uid, 'chats_list.partnerId': myPartnerId })
                    if (MyChatDoc) {
                        const chatsArray = MyChatDoc.chats_list
                        const onlyPartnersMessages = chatsArray.filter(x => x.partnerId == myPartnerId)
                        const lastMessage = onlyPartnersMessages[onlyPartnersMessages.length - 1]
                        lastTwoMessage.push(lastMessage)
                    }

                    const PartnerChatDoc = await Chats.findOne({ uid: myPartnerId, 'chats_list.partnerId': data.uid })
                    if (PartnerChatDoc) {
                        const chatsArray = PartnerChatDoc.chats_list
                        const onlyPartnersMessages = chatsArray.filter(x => x.partnerId == data.uid)
                        const lastMessage = onlyPartnersMessages[onlyPartnersMessages.length - 1]
                        lastTwoMessage.push(lastMessage)
                    }
                    let finalMessage = fetchMessageData(lastTwoMessage)[fetchMessageData(lastTwoMessage).length - 1]

                    let finalMessageObj
                    if (finalMessage) finalMessageObj = { messageObj: finalMessage, name: contact.name, isMe: (finalMessage.partnerId != data.uid) ? true : false, partnerId: contact.id }

                    return finalMessageObj
                }))
                LastMessageList = values?.filter(Boolean)
            }
            res.status(200).json(LastMessageList)
            break
        default:
            res.status(400).json({
                error: true,
                message: 'unknown request',
            })
            break
    }
}