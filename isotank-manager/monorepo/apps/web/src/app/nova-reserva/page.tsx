"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  razaoSocial: z.string().min(3, "Razão social deve ter no mínimo 3 caracteres"),
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ deve conter 14 números"),
  inscricaoEstadual: z.string().min(1, "Inscrição estadual é obrigatória"),
  cep: z.string().regex(/^\d{8}$/, "CEP deve conter 8 números"),
  produto: z.string().min(2, "Obrigatório informar o produto"),
  telefone: z.string().min(10, "Telefone inválido para contato WhatsApp"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NovaReserva() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simular chamada de API para o Cloudflare Worker
      // mock do fetch
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Reserva criada com sucesso, enviando notificação WhatsApp...", data);
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar reserva.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-10 bg-green-50 border border-green-200 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Reserva Solicitada!</h2>
        <p className="text-green-700 mb-6">
          Sua reserva foi encaminhada para aprovação. O operador receberá uma notificação no WhatsApp em breve.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
        >
          Nova Solicitação
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 mt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nova Reserva</h1>
        <p className="text-muted-foreground mt-2">
          Preencha os dados cadastrais da empresa e da carga. Uma notificação será enviada via WhatsApp para aprovação.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Razão Social</label>
            <input 
              {...register("razaoSocial")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Empresa LTDA"
            />
            {errors.razaoSocial && <p className="text-sm text-red-500">{errors.razaoSocial.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">CNPJ (Apenas números)</label>
            <input 
              {...register("cnpj")}
              maxLength={14}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="00000000000000"
            />
            {errors.cnpj && <p className="text-sm text-red-500">{errors.cnpj.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Inscrição Estadual</label>
            <input 
              {...register("inscricaoEstadual")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="123456789"
            />
            {errors.inscricaoEstadual && <p className="text-sm text-red-500">{errors.inscricaoEstadual.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">CEP (Apenas números)</label>
            <input 
              {...register("cep")}
              maxLength={8}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="00000000"
            />
            {errors.cep && <p className="text-sm text-red-500">{errors.cep.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Produto/Carga</label>
            <input 
              {...register("produto")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ex: Ácido Sulfúrico"
            />
            {errors.produto && <p className="text-sm text-red-500">{errors.produto.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp do Responsável</label>
            <input 
              {...register("telefone")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="11999999999"
            />
            {errors.telefone && <p className="text-sm text-red-500">{errors.telefone.message}</p>}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-primary text-primary-foreground font-semibold rounded-md shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Processando..." : "Solicitar Reserva"}
          </button>
        </div>
      </form>
    </div>
  );
}
