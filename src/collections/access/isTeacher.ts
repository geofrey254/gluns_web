import { AccessArgs } from 'payload'

export const isTeacher = ({ req }: AccessArgs): boolean => {
  return req.user?.collection === 'users' && req.user.roles === 'teacher'
}
