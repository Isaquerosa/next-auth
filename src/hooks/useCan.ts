import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { validateUserPermissions } from "../utils/validateUserPermissions"


interface UseCanParams {
  permissions?: string[]
  roles?: string[]
}

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if(!isAuthenticated) {
    return false
  }

  const userHasValidPermissions = validateUserPermissions({
    user, 
    permissions, 
    roles
  })

  // if(permissions?.length > 0) {
  //   const hasAllPermissions = permissions.every(permission => {
  //     return user.permissions.includes(permission)
  //   })

  //   if(!hasAllPermissions) {
  //     return false
  //   }
  // }

  // if(roles?.length > 0) {
  //   const hasAllRoles = permissions.some(role => {
  //     return user.roles.includes(role)
  //   })

  //   if(!hasAllRoles) {
  //     return false
  //   }
  // }

  return userHasValidPermissions
}