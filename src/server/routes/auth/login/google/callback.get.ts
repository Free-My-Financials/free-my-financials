import { OAuth2RequestError } from 'arctic'
import { google, lucia } from '~/server/utils/auth'
import { getUserByGoogleId } from '~/server/utils/prisma/user'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'google_oauth_state') ?? null

  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    })
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, 'AHAHAHA')
    const googleUserResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    )
    const googleUser: GoogleUser = await googleUserResponse.json()

    const existingUser = await getUserByGoogleId(googleUser.sub)

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      appendHeader(
        event,
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize()
      )
      return sendRedirect(event, '/')
    }

    const user = await createUser({
      username: googleUser.sub,
      googleId: googleUser.sub,
    })

    const session = await lucia.createSession(user.id, {})
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize()
    )
    return sendRedirect(event, '/')
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      throw createError({
        status: 400,
      })
    }
    throw createError({
      status: 500,
    })
  }
})

interface GoogleUser {
  sub: string
}
