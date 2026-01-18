import { AccessArgs } from 'payload'
import { isAdmin } from './isAdmin'
import { isTeacher } from './isTeacher'

export const adminOrOwnTeacher = ({ req }: AccessArgs) => {
  if (!req.user) return false

  if (isAdmin({ req })) {
    return true
  }

  if (isTeacher({ req })) {
    return {
      teacher: {
        equals: req.user.id,
      },
    }
  }

  return false
}
