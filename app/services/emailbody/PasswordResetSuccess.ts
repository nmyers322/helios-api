import theme from "../../../inertia/app/src/modules/theme.js"; // Adjust the path if needed

export default class PasswordResetSuccess {
    public static getEmailBody() {
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

        const emailBody = `
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${style}
            <body style="font-family: 'Trebuchet MS', sans-serif; font-size: ${t.fonts.size}; background: ${t.colors.background}; color: ${t.colors.text};">
                <div class="card" id="card" style="background:${t.colors.cardBackground};border-radius:1rem;padding:1rem 2rem 1.5rem 2rem;max-width:40rem;margin:auto;font-family:'Trebuchet MS',sans-serif;">
                    <img src="${process.env.VITE_REACT_APP_DOMAIN}/helios-text-yellow-1000.png" alt="Helios Press Logo" style="width: 100px; height: auto;" />
                    <h1>Password Reset Success</h1>
                    <p>Your password was recently changed.</p>
                </div>
            </body>
        `;
        return emailBody;
    }
}