import { OAuth2RequestError } from "arctic"
import { github, lucia } from "~/server/utils/auth"
import { getUserByGithubId } from "~/server/utils/prisma/user"

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

    const existingUser = await getUserByGithubId(githubUser.id)

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
      return sendRedirect(event, "/")
    }

    const user = await createUser({
      username: githubUser.login,
      githubId: githubUser.id
    })

    const session = await lucia.createSession(user.id, {})
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
    return sendRedirect(event, "/")
  } catch (e) {
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
