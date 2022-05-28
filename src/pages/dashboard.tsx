import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { api } from "../services/api"



export default function Dashboard() {
  const { user } = useContext(AuthContext)

  api.get('/me')
  .then((response) => {
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  })

  return (
    <h1>Hello wORLD: {user?.email}</h1>
  )
}