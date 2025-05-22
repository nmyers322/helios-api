import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import BadRequestException from '#exceptions/bad_request_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import EmailService from '#services/EmailService'
import PasswordReset from '#models/password_reset'
import hash from '@adonisjs/core/services/hash'
import PasswordResetRequest from '#services/emailbody/PasswordResetRequest'
import { randomBytes } from 'crypto'
import PasswordResetSuccess from '#services/emailbody/PasswordResetSuccess'

const MIN_INPUT_LENGTH = 2
const MAX_INPUT_LENGTH = 200
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default class UsersController {
  async create({ request, auth }: HttpContext) {
    const { email, password, password2 } = request.only(['email', 'password', 'password2'])
    if (!email || !password || !password2) {
      throw new BadRequestException('Email and password are required')
    }
    if (email.length < MIN_INPUT_LENGTH || email.length > MAX_INPUT_LENGTH) {
      throw new BadRequestException('Email must be between 2 and 200 characters')
    }
    if (password.length < MIN_INPUT_LENGTH || password.length > MAX_INPUT_LENGTH) {
      throw new BadRequestException('Password must be between 2 and 200 characters')
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestException('Invalid email format')
    }
    if (password !== password2) {
      throw new BadRequestException('Passwords do not match')
    }
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      throw new BadRequestException('User already exists')
    }
    const user = await User.create({ email, password })
    if (!user) {
      throw new InternalServerErrorException('Failed to create user')
    }
    return await auth.use('api').createToken(user);
  }

  async getMyAccount({ auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      throw new BadRequestException('User not found')
    }
    return user;
  }

  async update({ auth, request }: HttpContext) {
    const user = auth.user
    if (!user) {
      throw new BadRequestException('User not found')
    }
    const { firstName, lastName, company, phone } = request.only(['firstName', 'lastName', 'company', 'phone'])
    // Validate the input data
    if (firstName && (firstName.length < MIN_INPUT_LENGTH || firstName.length > MAX_INPUT_LENGTH)) {
      throw new BadRequestException('First name must be between 2 and 200 characters')
    }
    if (lastName && (lastName.length < MIN_INPUT_LENGTH || lastName.length > MAX_INPUT_LENGTH)) {
      throw new BadRequestException('Last name must be between 2 and 200 characters')
    }
    if (company && (company.length < MIN_INPUT_LENGTH || company.length > MAX_INPUT_LENGTH)) {
      throw new BadRequestException('Company name must be between 2 and 200 characters')
    }
    if (phone && (phone.length < MIN_INPUT_LENGTH || phone.length > MAX_INPUT_LENGTH)) {
      throw new BadRequestException('Phone number must be between 2 and 200 characters')
    }
    // Update the user data
    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.company = company || user.company
    user.phone = phone || user.phone
    await user.save()
    return user;
  }

  async requestResetPassword({ request, response }: HttpContext) {
    const { email } = request.only(['email'])
    if (!email) {
      throw new BadRequestException('Email is required')
    }
    if (email.length < MIN_INPUT_LENGTH || email.length > MAX_INPUT_LENGTH) {
      throw new BadRequestException('Email must be between 2 and 200 characters')
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestException('Invalid email format')
    }
    const user = await User.findBy('email', email)
    response.status(200).send('Password reset email sent')
    if (user) {
      const token = (await hash.make(randomBytes(32).toString('hex'))).split('$')[3]
      await PasswordReset.create({
        userId: user.id,
        token: token
      })
      EmailService.sendEmail(email, 'Your password reset link', PasswordResetRequest.getEmailBody(token));
    } 
  }

  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])
    if (!token || !password) {
      throw new BadRequestException('Token and password are required')
    }
    if (password.length < MIN_INPUT_LENGTH || password.length > MAX_INPUT_LENGTH) {
      throw new BadRequestException('Password must be between 2 and 200 characters')
    }
    const passwordReset = await PasswordReset.findBy('token', token)
    if (!passwordReset) {
      throw new BadRequestException('Invalid token')
    }
    if (passwordReset.createdAt.diffNow().hours > 1) {
      await passwordReset.delete()
      throw new BadRequestException('Token expired')
    }
    const user = await User.find(passwordReset.userId)
    if (!user) {
      throw new BadRequestException('User not found')
    }
    user.password = password
    await user.save()
    await passwordReset.delete()
    response.status(200).send('Password reset successfully')
    EmailService.sendEmail(user.email, 'Your password has been reset', PasswordResetSuccess.getEmailBody());
  }
}
