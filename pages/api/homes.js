import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler (req, res) {

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({
            'message': `method not allowed`
        })
    }
    
    try {
        const {
            image, title,
            description, price,
            guests, beds,
            baths, 
        } = req.body
        const home = await prisma.home.create({
            data: {
                image, title,
                description, price,
                guests, beds, baths
            }
        })
        res.status(200).json(home)
    } 
    catch (error) {
        res.status(422).json({
            message: 'unable to handle request'
        })
    }
}