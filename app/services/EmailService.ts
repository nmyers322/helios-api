import mail from '@adonisjs/mail/services/main'

export default class EmailService {
    public static async sendEmail(to: string, subject: string, body: string) {
        console.log('Sending email to:', to);
        console.log('Subject:', subject);
        console.log('Body:', body);
        try {
            await mail.send((message) => {
                message
                    .to(to)
                    .from(process.env.MAIL_FROM_ADDRESS!)
                    .subject(subject)
                    .html(body);
            });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}