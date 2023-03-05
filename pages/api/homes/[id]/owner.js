import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({
            message: 'not allowed'
        })
    }
    const session = await getSession({req})
    if (!session) {
        res.status(401).json({
            message: 'unauthorized request'
        })
    }
    try {
        const { id } = req.query
        const home = await prisma.home.findUnique({
            where: {id: id},
            select: {owner: true}
        })
        if (!home) {
            res.status(404).json({
                message: 'incorrect home credientials'
            })
        }
        res.status(200).json(home.owner)
    } catch (error) {
        res.status(422).json({
            message: 'unable to handle request'
        })
    }
}

export default handler