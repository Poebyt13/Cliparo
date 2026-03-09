# Email Templates

Template React per le email transazionali, costruiti con [`@react-email/components`](https://react.email) e inviati tramite [Resend](https://resend.com).

## Template disponibili

| File | Quando usarlo |
|------|--------------|
| `welcome.jsx` | Registrazione nuovo utente |
| `login.jsx` | Magic link di accesso (usato automaticamente da Auth.js) |
| `paymentConfirmation.jsx` | Conferma pagamento abbonamento Stripe |
| `passwordReset.jsx` | Reset password (link valido 1 ora) |

---

## Utilizzo

Importa sempre `sendEmail` da `@/lib/resend` e passa il template come prop `react`.

### Benvenuto

```js
import { sendEmail } from "@/lib/resend";
import WelcomeEmail from "@/emails/welcome";

await sendEmail({
  to: user.email,
  subject: "Benvenuto!",
  react: WelcomeEmail({ name: user.name, dashboardUrl: "/dashboard" }),
});
```

### Magic Link (login)

> Viene chiamato automaticamente da Auth.js. Usalo manualmente solo se necessario.

```js
import { sendEmail } from "@/lib/resend";
import LoginEmail from "@/emails/login";

await sendEmail({
  to: user.email,
  subject: "Accedi al tuo account",
  react: LoginEmail({ loginUrl: magicLinkUrl, email: user.email }),
});
```

### Conferma pagamento

```js
import { sendEmail } from "@/lib/resend";
import PaymentConfirmationEmail from "@/emails/paymentConfirmation";

await sendEmail({
  to: user.email,
  subject: "Pagamento confermato",
  react: PaymentConfirmationEmail({
    name: user.name,
    plan: "Premium",
    amount: "€9.99",
    date: new Date().toLocaleDateString("it-IT"),
    dashboardUrl: "/dashboard",
  }),
});
```

### Reset password

```js
import { sendEmail } from "@/lib/resend";
import PasswordResetEmail from "@/emails/passwordReset";

await sendEmail({
  to: user.email,
  subject: "Reimposta la tua password",
  react: PasswordResetEmail({ name: user.name, resetUrl: resetLink }),
});
```

---

## Variabili d'ambiente richieste

```env
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@tuodominio.com
```

## Aggiungere un nuovo template

1. Crea un file `.jsx` in questa cartella (es. `invoiceEmail.jsx`)
2. Usa i componenti di `@react-email/components` (`Html`, `Body`, `Container`, `Text`, `Button`…)
3. Esporta il componente come `default`
4. Usalo con `sendEmail({ react: InvoiceEmail({ ... }) })`
