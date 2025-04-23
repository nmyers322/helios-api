import { Exception } from '@adonisjs/core/exceptions'

export default class InternalServerErrorException extends Exception {
  static status = 500
}