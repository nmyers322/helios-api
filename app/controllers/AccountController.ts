import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import BadRequestException from '#exceptions/bad_request_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

const MIN_INPUT_LENGTH = 2
const MAX_INPUT_LENGTH = 200
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default class AccountController {
  async create({ request, auth }: HttpContext) {
    const { email, password, password2 } = request.only(['email', 'password', 'password2'])
    // Validate the email and password
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
    // Check if the password matches
    if (password !== password2) {
      throw new BadRequestException('Passwords do not match')
    }
    // Check if the user exists
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      throw new BadRequestException('User already exists')
    }
    // Create a new user
    const user = await User.create({ email, password })
    if (!user) {
      throw new InternalServerErrorException('Failed to create user')
    }
    // Generate a token for the user
    return await auth.use('api').createToken(user);
  }
}
