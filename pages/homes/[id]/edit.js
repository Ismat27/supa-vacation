import Layout from "@/components/Layout"
import ListingForm from "@/components/ListingForm"
import { getSession } from "next-auth/react"
import axios from "axios"
import { prisma } from "@/lib/prisma"

export const getServerSideProps = async (context) => {
    const redirect = {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    
    const session = await getSession(context)
    if (!session) {
        return redirect
    }
    const homeId = context.params.id
    const user = await prisma.user.findUnique({
        where: {email: session.user.email},
        select: {homes: true}
    })
    const home = user?.homes?.find(home => home.id === homeId )
    if (!home) {
        return redirect
    }

    return {
        props: JSON.parse(JSON.stringify(home))
    }
}

const HomeEditPage = (home = null) => {

    const handleOnSubmit = data =>
    axios.patch(`/api/homes/${home.id}`, data);
  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">Edit your home</h1>
        <p className="text-gray-500">
          Fill out the form below to update your home.
        </p>
        <div className="mt-8">
          {home ? (
            <ListingForm
              initialValues={home}
              buttonText="Update home"
              redirectPath={`/homes/${home.id}`}
              onSubmit={handleOnSubmit}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  )
}

export default HomeEditPage