import { getSession } from "next-auth/react"
import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/prisma";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const handler =  async (req, res) => {
    const session = await getSession({req})

    if (!session) {
        res.status(401).json({
            message: 'unauthorized'
        })
    }

    const {id} = req.query
    const user = await prisma.user.findUnique({
        where: {email: session.user.email},
        select: {homes: true}
    })

    const home = user?.homes?.find(home => home.id === id)
    if (!home) {
        res.status(404).json({
            message: 'home not found'
        })
    }

    if (req.method === 'GET') {
        try {
            res.status(200).json(home)
        } catch (error) {
            res.status(500).json({
                message: 'unable to handle request'
            })
        }
    }

    if (req.method === 'PATCH') {
        try {
            const updatedHome = await prisma.home.update({
                where: {id: id},
                data: req.body
            })
            res.status(201).json(updatedHome)
        } 
        catch (error) {
            res.status(500).json({
                message: 'unable to handle request'
            })
        }
    }

    if (req.method === 'DELETE') {
        try {
            const home = await prisma.home.delete({
                where: {id: id}
            })
            if (home.image) {
                const path = home.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1];
                await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([path]);
            }
            res.status(201).json(home)
        } 
        catch (error) {
            res.status(500).json({
                message: 'unable to handle request'
            })
        }
    }

    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });

}

export default  handler