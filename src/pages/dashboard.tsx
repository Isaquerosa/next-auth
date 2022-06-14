import { destroyCookie } from "nookies"
import { useContext, useEffect } from "react"
import { Can } from "../components/Can"
import { AuthContext } from "../contexts/AuthContext"
import { useCan } from "../hooks/useCan"
import { setUpAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import { withSSRAuth } from "../utils/withSSRAuth"



export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
    .then(response => console.log(response))
  }, [])

  return (
    <>
      <h1>Hello wORLD: {user?.email}</h1>

      <button onClick={signOut}>Sign Out</button>

      <Can permissions={['metrics.list']}>
        <div>Métricas: 

          <button>Carregar mais métricas</button>
          <p>Essas são as métricas</p>
        </div>
      </Can>
    </>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setUpAPIClient(ctx)
  
  const response = await apiClient.get('/me')

  return {
    props: {}
  }
})