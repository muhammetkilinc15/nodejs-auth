import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const TOKEN = process.env.MAILTRACK_TOKEN; // Mailtrap API token
const ENDPOINT = process.env.MAILTRACK_ENDPOINT; // Mailtrap API endpoint


export const _mailTrapClient = new MailtrapClient({
    token: TOKEN,
    endpoint: ENDPOINT,
});

export const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Muhammet Kılınç - Node.js Developer",
};
