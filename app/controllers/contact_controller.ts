import EmailService from '#services/EmailService';
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios';

export default class ContactController {
    async sendMessage({ request, response }: HttpContext) {
        const { email, comment, recaptchaToken } = request.all();
        if (!email || !comment || !recaptchaToken) {
            return response.status(400).json({ error: 'Missing required fields' });
        }
        const googleRecaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
        const recaptchaData = {
            secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
            response: recaptchaToken,
            remoteip: request.ip(),
        }
        try {
            const recaptchaResponse = await axios.post(googleRecaptchaVerifyUrl, null, {
                params: recaptchaData,
            });
            if (!recaptchaResponse.data.success) {
                console.log('Recaptcha response:', recaptchaResponse.data);
                return response.status(400).json({ error: 'Recaptcha verification failed' });
            } else {
                response.status(200).json({ message: 'Recaptcha verification successful' });
                EmailService.sendEmail(process.env.MAIL_FROM_ADDRESS!, 'Contact Form Submission', `
                    <p>You have received a new message from the contact form:</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Comment:</strong> ${comment}</p>
                    `);
            }
        } catch (error) {
            return response.status(500).json({ error: 'Recaptcha verification service is unavailable' });
        }
    }

}