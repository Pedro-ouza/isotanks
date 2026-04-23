import { Hono } from "hono";
import { z } from "zod";

const app = new Hono<{ Bindings: { DB: any } }>();

const reservaSchema = z.object({
  razaoSocial: z.string().min(3),
  cnpj: z.string().regex(/^\d{14}$/),
  inscricaoEstadual: z.string(),
  cep: z.string().regex(/^\d{8}$/),
  produto: z.string().min(2),
  telefone: z.string().min(10),
});

app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date() }));

app.post("/api/reservas", async (c) => {
  try {
    const body = await c.req.json();
    const result = reservaSchema.safeParse(body);

    if (!result.success) {
      return c.json({ error: "Dados inválidos", details: result.error.errors }, 400);
    }

    const { cnpj, telefone } = result.data;

    // TODO: Salvar no D1
    // const db = c.env.DB;
    // await db.prepare("INSERT INTO reservas...").run();

    // Mock Integração WhatsApp/Teams
    console.log(`[WhatsApp Mock] Enviando notificação para o telefone ${telefone} informando nova reserva do CNPJ: ${cnpj}`);

    return c.json({
      success: true,
      message: "Reserva criada com sucesso. Notificação enviada.",
      reservaId: crypto.randomUUID()
    }, 201);
  } catch (error) {
    console.error("Erro interno:", error);
    return c.json({ error: "Erro interno no servidor" }, 500);
  }
});

export default app;
