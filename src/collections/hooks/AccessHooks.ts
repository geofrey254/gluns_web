import type { Access } from 'payload'
import type { User } from '@/payload-types'

export const canUpdateUser: Access<User> = ({ req: { user }, id }) => {
  if (!user) return false

  // 2. If user is admin, allow full access
  // We check for both array and string to be safe
  const isAdmin = user.roles?.includes('admin')
  if (isAdmin) return true

  // 3. For 'read' or 'update', allow users to access their own record
  // If 'id' is present (the record being accessed), check if it matches the logged-in user
  if (id && user.id === id) {
    return true
  }

  return false
}
