import type { HttpContext } from '@adonisjs/core/http'

import Address from "#models/address"

export default class AddressesController {
    async getAll({ auth, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' })
        }
        const userId = user.id
        const addresses = await Address.query().where('userId', userId).orderBy('createdAt', 'desc')
        return response.status(200).json(addresses)
    }

    async createOrUpdate({ auth, request, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' })
        }
        const userId = user.id
        const { type, firstName, lastName, company, address1, address2, city, state, postcode, country, phone } = request.all()

        if (!userId || !type || !firstName || !lastName || !address1 || !city || !state || !postcode || !country) {
            console.log('Missing required fields')
            console.log({ userId, type, firstName, lastName, address1, address2, city, state, postcode, country, phone })
            return response.status(400).json({ error: 'Missing required fields' })
        }
        if (type !== 'shipping' && type !== 'billing') {
            console.log('Invalid address type')
            console.log({ type })
            return response.status(400).json({ error: 'Invalid address type' })
        }
        if (type === 'billing' && (!phone || !company)) {
            console.log('Missing required fields for billing address')
            console.log({ phone, company })
            return response.status(400).json({ error: 'Missing required fields for billing address' })
        }

        const address = await Address.query().where('userId', userId).where('type', type).first()
        if (!address) {
            const newAddress = new Address()
            newAddress.userId = userId
            newAddress.type = type
            newAddress.firstName = firstName
            newAddress.lastName = lastName
            newAddress.company = company
            newAddress.address1 = address1
            newAddress.address2 = address2
            newAddress.city = city
            newAddress.state = state
            newAddress.postcode = postcode
            newAddress.country = country
            newAddress.phone = phone

            await newAddress.save()

            return response.status(201).json(newAddress)
        } else {
            address.type = type
            address.firstName = firstName
            address.lastName = lastName
            address.company = company
            address.address1 = address1
            address.address2 = address2
            address.city = city
            address.state = state
            address.postcode = postcode
            address.country = country
            address.phone = phone

            await address.save()

            return response.status(200).json(address)
        }
    }
    async delete({ auth, request, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' })
        }
        const userId = user.id
        const { type } = request.all()

        if (!userId || !type) {
            return response.status(400).json({ error: 'Missing required fields' })
        }

        const address = await Address.query().where('userId', userId).where('type', type).first()
        if (!address) {
            return response.status(404).json({ error: 'Address not found' })
        }
        await address.delete()

        return response.status(200).json({ message: 'Address deleted successfully' })
    }
}