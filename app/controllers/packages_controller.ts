import type { HttpContext } from '@adonisjs/core/http'
import PressingPackage from '#models/pressing_package'
import DiscountService from '#services/DiscountService'
import PackageService, { PACKAGE_FORM_FIELDS } from '#services/PackageService'

const toPublicPackage = (pressingPackage: PressingPackage) => ({
  id: pressingPackage.id,
  name: pressingPackage.name,
  slug: pressingPackage.slug,
  description: pressingPackage.description ?? null,
  ctaLabel: pressingPackage.ctaLabel ?? null,
  advertisedPrice: Number(pressingPackage.advertisedPrice),
  sortOrder: pressingPackage.sortOrder,
  formConfig: pressingPackage.formConfig,
})

const toAdminPackage = (pressingPackage: PressingPackage) => ({
  ...toPublicPackage(pressingPackage),
  isActive: pressingPackage.isActive,
})

const validateName = (name: unknown) =>
  typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 160

const validateOptionalText = (value: unknown, maxLength: number) =>
  value == null || (typeof value === 'string' && value.trim().length <= maxLength)

const validateSortOrder = (sortOrder: unknown) =>
  Number.isInteger(sortOrder) && (sortOrder as number) >= 0

const validateFormConfig = (formConfig: unknown) => {
  if (!formConfig || typeof formConfig !== 'object') {
    return false
  }
  const config = formConfig as Record<string, unknown>
  return PACKAGE_FORM_FIELDS.every((field) => field in config)
}

const parsePayload = (request: HttpContext['request']) => {
  const name = request.input('name')
  const slug = request.input('slug')
  const description = request.input('description')
  const ctaLabel = request.input('ctaLabel')
  const advertisedPrice = Number(request.input('advertisedPrice'))
  const catalogSubtotal = Number(request.input('catalogSubtotal'))
  const isActive = request.input('isActive', true)
  const sortOrder = request.input('sortOrder', 0)
  const formConfig = request.input('formConfig')

  if (!validateName(name)) {
    return { error: 'Invalid package name' }
  }
  if (!PackageService.validatePackageSlug(slug)) {
    return { error: 'Invalid slug. Use lowercase letters, numbers, and hyphens' }
  }
  if (!validateOptionalText(description, 2000)) {
    return { error: 'Invalid description' }
  }
  if (!validateOptionalText(ctaLabel, 200)) {
    return { error: 'Invalid CTA label' }
  }
  if (typeof isActive !== 'boolean') {
    return { error: 'Invalid isActive flag' }
  }
  if (!validateSortOrder(sortOrder)) {
    return { error: 'Invalid sortOrder value' }
  }
  if (!validateFormConfig(formConfig)) {
    return { error: 'Package form configuration is incomplete' }
  }
  const advertisedCheck = DiscountService.validateAdvertisedPrice(advertisedPrice, catalogSubtotal)
  if (!advertisedCheck.valid) {
    return { error: advertisedCheck.error }
  }

  return {
    payload: {
      name: name.trim(),
      slug: slug.trim(),
      description: typeof description === 'string' ? description.trim() || null : null,
      ctaLabel: typeof ctaLabel === 'string' ? ctaLabel.trim() || null : null,
      advertisedPrice: advertisedPrice.toFixed(2),
      isActive,
      sortOrder,
      formConfig: PackageService.extractFormConfig(formConfig),
    },
  }
}

export default class PackagesController {
  async getAll() {
    const packages = await PressingPackage.query()
      .where('is_active', true)
      .orderBy('sort_order', 'asc')
      .orderBy('name', 'asc')

    return packages.map(toPublicPackage)
  }

  async getAllAdmin() {
    const packages = await PressingPackage.query()
      .orderBy('sort_order', 'asc')
      .orderBy('name', 'asc')

    return { packages: packages.map(toAdminPackage) }
  }

  async create({ request, response }: HttpContext) {
    const parsed = parsePayload(request)
    if ('error' in parsed) {
      return response.status(422).send({ error: parsed.error })
    }

    const existing = await PressingPackage.findBy('slug', parsed.payload.slug)
    if (existing) {
      return response.status(409).send({ error: 'A package with that slug already exists' })
    }

    const pressingPackage = await PressingPackage.create(parsed.payload)
    return response.status(201).send({ package: toAdminPackage(pressingPackage) })
  }

  async update({ params, request, response }: HttpContext) {
    const pressingPackage = await PressingPackage.find(params.id)
    if (!pressingPackage) {
      return response.status(404).send({ error: 'Package not found' })
    }

    const parsed = parsePayload(request)
    if ('error' in parsed) {
      return response.status(422).send({ error: parsed.error })
    }

    const existing = await PressingPackage.query()
      .where('slug', parsed.payload.slug)
      .whereNot('id', pressingPackage.id)
      .first()
    if (existing) {
      return response.status(409).send({ error: 'A package with that slug already exists' })
    }

    pressingPackage.merge(parsed.payload)
    await pressingPackage.save()
    return { package: toAdminPackage(pressingPackage) }
  }

  async destroy({ params, response }: HttpContext) {
    const pressingPackage = await PressingPackage.find(params.id)
    if (!pressingPackage) {
      return response.status(404).send({ error: 'Package not found' })
    }

    await pressingPackage.delete()
    return response.status(204).send('')
  }
}
