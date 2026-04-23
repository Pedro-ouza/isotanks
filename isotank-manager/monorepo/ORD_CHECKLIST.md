# Operational Readiness Review (ORD) - Isotank Manager

Este checklist define os critérios de aceitação necessários para liberar a Fase 1 da aplicação para o time de operações em produção.

## 1. Segurança e Conformidade
- [ ] **Autenticação:** MFA habilitado e obrigatório via provedor de identidade (Auth0/Clerk).
- [ ] **Autorização:** Controles de RBAC (Role-Based Access Control) aplicados em todos os endpoints sensíveis.
- [ ] **Proteção (WAF):** Cloudflare WAF ativado com o OWASP Core Rule Set.
- [ ] **Dados (LGPD):** Termo de aceite e Política de Privacidade publicados; processo de anonimização ou exclusão de dados criado.
- [ ] **Rate Limiting:** Endpoints limitados a 100 requisições por minuto por usuário no Cloudflare API Gateway.

## 2. Performance e Escalabilidade
- [ ] **Testes de Carga:** Scripts K6 rodados com sucesso simulando 1000 VUs durante 30 min com taxa de erros menor que 2%.
- [ ] **Tempo de Carregamento:** First Contentful Paint (FCP) e Time to Interactive (TTI) abaixo de 2 segundos em rede simulada 4G.
- [ ] **Otimização de Frontend:** Imagens otimizadas (Next/Image), caching estático configurado no Cloudflare Pages.

## 3. Observabilidade e Monitoramento
- [ ] **Logs:** Todos os erros críticos e avisos da API (Workers) estão sendo encaminhados de forma estruturada.
- [ ] **Status Page:** `status.isotankmanager.com.br` está online, configurada e consumindo o status real dos serviços de borda (Cloudflare) e parceiros.
- [ ] **Alertas:** Alertas críticos no PagerDuty/Teams estão testados (ruído reduzido a < 5 alertas acionáveis por dia).

## 4. Recuperação de Desastres (DR) e Backups
- [ ] **Replicação de BD:** Réplicas de leitura global do D1 configuradas e sincronizadas.
- [ ] **Backup:** Script automático de backup (dump D1) rodando diariamente com envio seguro para bucket s3/R2 em região separada (ex: SP -> RJ).
- [ ] **Simulação:** Plano de resposta a incidentes testado (simulação controlada de violação de dados executada e documentada).

## 5. Suporte e Documentação
- [ ] **Documentação de API:** Swagger UI (OpenAPI 3.0) publicado com exemplos claros de requests, responses e autenticação.
- [ ] **Playbooks:** Treinamento do time de Suporte (N1) concluído. Playbooks para (a) login falho, (b) isotank extraviado, e (c) indisponibilidade da API do WhatsApp redigidos.
- [ ] **SLA Assinado:** Contrato de nível de serviço de 99,9% mensal pactuado com o cliente piloto.
