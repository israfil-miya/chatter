import dbConnect from "../../db/dbConnect"
dbConnect()
import Chats from '../../db/Chats'
import Contacts from "../../db/Contacts"
import User from '../../db/Users'



const fetchMessageData = (AllMessagesArr) => {

    return (
        AllMessagesArr.sort((x, y) => {
            return new Date(x.updatedAt) < new Date(y.updatedAt) ? 1 : -1
        })
    ).reverse()
}


export default async function handle(req, res) {
    const data = req.body
    const { method } = req

    switch (method) {
        case "GET":
            res.status(400).json({
                error: true,
                message: 'GET operation not allowed in this route',
            })
            break;
        case "POST":

            if (data.chatsRetrieve) {

                let onlyPartnersMessages
                let NewOnlyPartnersMessages

                const MySideChats = await Chats.findOne({ uid: data.uid, 'chats_list.partnerId': data.partnerId })
                if (MySideChats) {
                    const chatsArray = MySideChats.chats_list
                    onlyPartnersMessages = chatsArray.filter(x => x.partnerId == data.partnerId)
                } else onlyPartnersMessages = []

                const PartnerSideChats = await Chats.findOne({ uid: data.partnerId, 'chats_list.partnerId': data.uid })
                if (PartnerSideChats) {
                    const partnerChatsArray = PartnerSideChats.chats_list
                    NewOnlyPartnersMessages = partnerChatsArray.filter(x => x.partnerId == data.uid)
                } else NewOnlyPartnersMessages = []


                const concatedArray = [].concat(onlyPartnersMessages, NewOnlyPartnersMessages)
                res.status(200).json(fetchMessageData(concatedArray))
            } else {
                const chatsData = await Chats.updateOne({ uid: data.id }, {
                    uid: data.id, $push: {
                        chats_list: {
                            partnerId: data.partnerId,
                            message: data.message
                        }
                    },
                }, { upsert: true, new: true })
                if (chatsData) res.status(200).json({ UserSide: chatsData })
                else res.status(400).json({ error: true, message: "Unable to store message in database" })
            }
            break
        default:
            break;
    }

}