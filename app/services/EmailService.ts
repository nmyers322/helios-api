export default class EmailService {
    public static async sendEmail(to: string, subject: string, body: string) {
        console.log('Sending email to:', to);
        console.log('Subject:', subject);
        console.log('Body:', body);
        // Implement your email sending logic here
    }
}