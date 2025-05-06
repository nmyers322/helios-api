import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class OauthsController {
    async googleLogin({ ally, auth, inertia, response }: HttpContext) {
        const google = ally.use('google')
    
        if (google.accessDenied()) {
            return response.redirect().toPath('/login?error=access_denied')
        }
    
        if (google.stateMisMatch()) {
            return response.redirect().toPath('/login?error=state_mismatch')
        }
    
        if (google.hasError()) {
            console.log("Google login error:", google.getError())
            return response.redirect().toPath('/login?error=unknown')
        }
    
        const googleUser = await google.user()
        let user = await User.findBy('email', googleUser?.email);
        if (!user) {
            user = await User.create({
                email: googleUser?.email,
                firstName: googleUser?.name?.split(' ')[0],
                lastName: googleUser?.name?.split(' ')[1],
                password: undefined
            });
        }
        const authResponse = await auth.use('api').createToken(user);
        return inertia.render('home', {
            auth: authResponse
        });
    }
}
