import { OAuth2RequestError } from "arctic"
import { generateId } from "lucia"
import { github, lucia } from "~/server/utils/lucia"
import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, "github_oauth_state") ?? null
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400
    })
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    })
    const githubUser: GitHubUser = await githubUserResponse.json()

    if (!prisma)
      prisma = new PrismaClient()

    const existingUser = await prisma.user.findFirst({
      where: {
        githubId: githubUser.id
      }
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
      return sendRedirect(event, "/")
    }

    const user = await prisma.user.create({
      data: {
        githubId: githubUser.id,
        username: githubUser.login
      }
    })

    const session = await lucia.createSession(user.id, {})
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
    return sendRedirect(event, "/")
  } catch (e) {
    console.log(e)

    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      throw createError({
        status: 400
      })
    }
    throw createError({
      status: 500
    })
  }
})

interface GitHubUser {
  id: number
  login: string
}
