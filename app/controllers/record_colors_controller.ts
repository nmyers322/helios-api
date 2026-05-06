import type { HttpContext } from '@adonisjs/core/http'
import RecordColor from '#models/record_color'

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

const toPublicColorOption = (recordColor: RecordColor) => ({
  id: recordColor.id,
  value: recordColor.name,
  label: recordColor.name,
  color: recordColor.hexColor,
})

const toAdminColorOption = (recordColor: RecordColor) => ({
  id: recordColor.id,
  name: recordColor.name,
  hexColor: recordColor.hexColor,
  isActive: recordColor.isActive,
  sortOrder: recordColor.sortOrder,
})

const validateName = (name: unknown) =>
  typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 120

const validateHexColor = (hexColor: unknown) =>
  typeof hexColor === 'string' && HEX_COLOR_REGEX.test(hexColor.trim())

const validateSortOrder = (sortOrder: unknown) =>
  Number.isInteger(sortOrder) && (sortOrder as number) >= 0

export default class RecordColorsController {
  async getAll() {
    const colors = await RecordColor.query()
      .where('is_active', true)
      .orderBy('sort_order', 'asc')
      .orderBy('name', 'asc')

    return colors.map(toPublicColorOption)
  }

  async getAllAdmin() {
    const colors = await RecordColor.query()
      .orderBy('sort_order', 'asc')
      .orderBy('name', 'asc')

    return { colors: colors.map(toAdminColorOption) }
  }

  async create({ request, response }: HttpContext) {
    const name = request.input('name')
    const hexColor = request.input('hexColor')
    const isActive = request.input('isActive', true)
    const sortOrder = request.input('sortOrder', 0)

    if (!validateName(name)) {
      return response.status(422).send({ error: 'Invalid color name' })
    }
    if (!validateHexColor(hexColor)) {
      return response.status(422).send({ error: 'Invalid hex color. Expected format #RRGGBB' })
    }
    if (typeof isActive !== 'boolean') {
      return response.status(422).send({ error: 'Invalid isActive flag' })
    }
    if (!validateSortOrder(sortOrder)) {
      return response.status(422).send({ error: 'Invalid sortOrder value' })
    }

    const trimmedName = name.trim()
    const normalizedHexColor = hexColor.trim().toUpperCase()
    const existing = await RecordColor.findBy('name', trimmedName)
    if (existing) {
      return response.status(409).send({ error: 'A color with that name already exists' })
    }

    const color = await RecordColor.create({
      name: trimmedName,
      hexColor: normalizedHexColor,
      isActive,
      sortOrder,
    })

    return response.status(201).send({ color: toAdminColorOption(color) })
  }

  async update({ params, request, response }: HttpContext) {
    const color = await RecordColor.find(params.id)
    if (!color) {
      return response.status(404).send({ error: 'Color not found' })
    }

    const name = request.input('name')
    const hexColor = request.input('hexColor')
    const isActive = request.input('isActive')
    const sortOrder = request.input('sortOrder')

    if (!validateName(name)) {
      return response.status(422).send({ error: 'Invalid color name' })
    }
    if (!validateHexColor(hexColor)) {
      return response.status(422).send({ error: 'Invalid hex color. Expected format #RRGGBB' })
    }
    if (typeof isActive !== 'boolean') {
      return response.status(422).send({ error: 'Invalid isActive flag' })
    }
    if (!validateSortOrder(sortOrder)) {
      return response.status(422).send({ error: 'Invalid sortOrder value' })
    }

    const trimmedName = name.trim()
    const normalizedHexColor = hexColor.trim().toUpperCase()
    const existing = await RecordColor.query()
      .where('name', trimmedName)
      .whereNot('id', color.id)
      .first()
    if (existing) {
      return response.status(409).send({ error: 'A color with that name already exists' })
    }

    color.name = trimmedName
    color.hexColor = normalizedHexColor
    color.isActive = isActive
    color.sortOrder = sortOrder
    await color.save()

    return { color: toAdminColorOption(color) }
  }

  async destroy({ params, response }: HttpContext) {
    const color = await RecordColor.find(params.id)
    if (!color) {
      return response.status(404).send({ error: 'Color not found' })
    }

    await color.delete()
    return response.status(204).send('')
  }
}
