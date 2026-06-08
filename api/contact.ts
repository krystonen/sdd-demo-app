type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  locale?: string;
};

type Res = {
  status: (code: number) => { json: (body: unknown) => void };
};

/** Vercel serverless handler — wire Resend/SendGrid in production. */
export default async function handler(
  req: { method?: string; body?: ContactBody },
  res: Res,
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const body = req.body;
  if (!body?.name || !body?.email || !body?.message) {
    res.status(400).json({ ok: false, errors: { form: "invalid" } });
    return;
  }

  console.info("[contact]", {
    name: body.name,
    email: body.email,
    locale: body.locale,
    messageLength: body.message.length,
  });

  res.status(200).json({ ok: true });
}
