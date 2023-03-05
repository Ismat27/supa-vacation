import { supabase } from '@/lib/supabase';
import { nanoid } from "nanoid"
import { decode } from "base64-arraybuffer"

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '10mb',
      },
    },
};
const BUCKET = process.env.SUPABASE_BUCKET

export default async function handler (req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({
            message: 'method not allowed'
        })
    }

    let { image } = req.body
    if (!image) {
        return res.status(400).json({
            message: "image not included"
        })
    }
    const contentType = image.match(/data:(.*);base64/)?.[1];
    const base64FileData = image.split('base64,')?.[1];

    if (!contentType || !base64FileData) {
        return res.status(400).json({ message: 'Image data not valid' });
    }
    try {
        const fileName = nanoid()
        const ext = contentType.split('/')[1];
        const path = `${fileName}.${ext}`;
        const {data, error:uploadError} = await supabase
            .storage
            .from(BUCKET)
            .upload(path, decode(base64FileData), {
                contentType,
                upsert: true
            })
        if (uploadError) {
            throw new Error('Unable to upload image to storage');
        }

        const url = `${process.env.SUPABASE_URL.replace('.co', '.in')}/storage/v1/object/public/${BUCKET}/${data.path}`;

        return res.status(200).json({ url, data });
        
    } catch (error) {
        res.status(422).json({
            'message': 'unable to handle request'
        })
    }
}