import Grid from "@/components/Grid";
import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export const getServerSideProps = async (context) => {
    const session = await getSession(context)
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const homes = await prisma.home.findMany({
        where: {owner: {email: session.user.email}},
        orderBy: {updatedAt: 'asc'}
    })

    return {
        props: {
            homes: JSON.parse(JSON.stringify(homes))
        }
    }
}

const UserListedHomes = ({homes}) => {
    return (
        <Layout>
            <h1 className="text-xl font-medium text-gray-800">Your listed homes</h1>
            <p className="text-gray-500">
                Manage your homes and update your listings
            </p>
            <div className="mt-8">
                <Grid homes={homes}/>
            </div>
        </Layout>
    )
}

export default UserListedHomes
