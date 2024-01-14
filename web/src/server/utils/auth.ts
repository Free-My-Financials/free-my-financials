import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

export const getUserFromHeader = async (authorization: string | undefined, prisma: PrismaClient) => {
  if (!authorization)
    return

  const token = authorization.split(' ')[1]

  const decoded = decodeAndVerifyJwtToken(token)

  if (!decoded)
    return

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  })

  return user
}

export const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '2d'
  })
}

export const decodeAndVerifyJwtToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
  } catch (error) {
    return null
  }
}
