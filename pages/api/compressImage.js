import sharp from "sharp"
export default async function Handle(req, res) {
    const { method } = req
    const data = req.body
    if (method == "POST") {

        const imagebase64 = data.imagebase64

        const splitted = imagebase64.split(',');
        const [, base64str] = splitted;

        const bufferImage = await sharp(Buffer.from(base64str, 'base64'))
        const meta = await bufferImage.metadata()

        const { format } = meta

        const config = {
          jpeg: { quality: 100 },
          webp: { quality: 100 },
          png: { quality: 50},
        }
        
        const resizedImage = await bufferImage[format](config[format])
          .resize(100).toBuffer()

        const base64Image = resizedImage.toString('base64')
        // const base64Image = base64str
        res.status(200).json({base64Image: `data:image/${format};base64,${base64Image}`})
    }
}

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '4mb' // Set desired value here
      }
  }
}