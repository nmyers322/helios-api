import theme from "../../../inertia/app/src/modules/theme.js"; // Adjust the path if needed

export default class PasswordResetRequest {
    public static getEmailBody(token: string) {
        const t = theme.light;

        const style = `
            <style>
                body {
                    font-family: ${t.fonts.base};
                    font-size: ${t.fonts.size};
                    background: ${t.colors.background};
                    color: ${t.colors.text};
                }
                h1, h2 {
                    color: ${t.colors.primary};
                }
                ul {
                    background: ${t.colors.cardBackground};
                    padding: 10px;
                    border-radius: 5px;
                }
                li {
                    color: ${t.colors.text};
                }
                a {
                    color: ${t.colors.link};
                }
                #card {
                    background-color: ${t.colors.cardBackground};
                    padding: 1rem 2rem 1.5rem 2rem;
                    border-radius: 1rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;
                    margin-right: 1rem;
                    margin-left: 1rem;
                    width: calc(100% - 12rem);
                    max-width: 40rem;

                    @media (max-width: 30rem) {
                        padding: 1rem 2rem 1.5rem 2rem;
                        width: calc(100% - 6rem);
                    }
                }
            </style>
        `;

        const resetLink = `${process.env.VITE_REACT_APP_DOMAIN}/reset-password?token=${encodeURIComponent(token)}`;

        const emailBody = `
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${style}
            <body style="font-family: 'Trebuchet MS', sans-serif; font-size: ${t.fonts.size}; background: ${t.colors.background}; color: ${t.colors.text};">
                <div class="card" id="card" style="background:${t.colors.cardBackground};border-radius:1rem;padding:1rem 2rem 1.5rem 2rem;max-width:40rem;margin:auto;font-family:'Trebuchet MS',sans-serif;">
                    <img src="${process.env.VITE_REACT_APP_DOMAIN}/helios-text-yellow-1000.png" alt="Helios Press Logo" style="width: 100px; height: auto;" />
                    <h1>Password Reset Request</h1>
                    <p>A password reset has been requested. Click the link below to reset your password.</p>
                    <p><a href="${resetLink}" style="background-color: ${t.colors.primary}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">${resetLink}</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            </body>
        `;
        return emailBody;
    }
}