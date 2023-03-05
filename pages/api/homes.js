import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient()

export default async function handler (req, res) {

    const session = await getSession({req})
    if (!session) {
        res.status(401).json({
            'message': 'user not authenticated'
        })
    }

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
        const user = await prisma.user.findUnique({
            where: {email: session.user.email}
        })
        const home = await prisma.home.create({
            data: {
                image, title,
                description, price,
                guests, beds, baths,
                ownerId: user.id
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