import { AccessArgs } from 'payload'

export const isAdmin = ({ req }: AccessArgs) => {
  // Admins come from the `admins` collection and have no `roles`
  return Boolean(req.user && !('roles' in req.user))
}
