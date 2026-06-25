# Isotanks — Documentação funcional da solução

## 1. Visão geral

A solução Isotanks é uma aplicação corporativa para SharePoint Online voltada à gestão operacional de isotanks, desde a entrada de dados em staging até a aprovação técnica, cadastro final, reserva e acompanhamento de disponibilidade.

O objetivo principal é centralizar e padronizar o processo de controle de isotanks, reduzindo decisões manuais, evitando reservas inconsistentes e dando visibilidade aos pedidos, equipamentos disponíveis e pendências operacionais.

Em termos práticos, a aplicação responde a perguntas como:

- Quais isotanks estão cadastrados e disponíveis?
- Quais isotanks ainda precisam de análise ou aprovação?
- Quais pedidos estão aguardando alocação?
- Qual isotank pode ser usado para determinado produto?
- Quais reservas estão solicitadas, pré-reservadas ou confirmadas?
- Existem pendências operacionais no momento?

A solução foi pensada para uso dentro do SharePoint, aproveitando listas SharePoint como base de dados operacional e webparts modernas para interface de uso.

## 2. Para que serve a aplicação

A aplicação serve para apoiar o ciclo de gestão de isotanks em um processo industrial/logístico que depende de compatibilidade entre produto, equipamento, fornecedor, disponibilidade e pedido.

Ela ajuda a:

- organizar o cadastro final de isotanks aprovados;
- separar itens novos ou pendentes em uma área de staging;
- permitir análise técnica antes de disponibilizar um isotank para uso;
- controlar a disponibilidade do equipamento;
- relacionar isotanks a pedidos de reserva;
- evitar que isotanks indisponíveis ou incompatíveis sejam pré-reservados;
- dar visibilidade gerencial por meio de indicadores;
- registrar responsáveis e comentários em decisões de aprovação ou rejeição.

## 3. Problema operacional que a solução resolve

Sem uma solução centralizada, a gestão de isotanks tende a depender de planilhas, comunicações manuais e verificações dispersas. Isso pode gerar problemas como:

- isotank reservado sem validação de produto compatível;
- duplicidade ou conflito de reserva;
- dificuldade para saber quais equipamentos estão disponíveis;
- falta de histórico mínimo de aprovação ou rejeição;
- ausência de visão consolidada dos pedidos abertos;
- demora para localizar pendências de staging;
- inconsistência nos nomes de produtos, fornecedores e status.

A aplicação organiza esses pontos em uma interface operacional única dentro do SharePoint.

## 4. Público-alvo e tipos de usuários

### 4.1 Usuário operacional de alocação

Responsável por analisar pedidos solicitados e pré-reservar isotanks compatíveis.

Principais atividades:

- consultar pedidos aguardando alocação;
- selecionar um pedido;
- visualizar isotanks compatíveis com o produto solicitado;
- pré-reservar um isotank;
- acompanhar mensagens de sucesso, erro ou ausência de equipamento compatível.

### 4.2 Analista técnico ou responsável por aprovação

Responsável por avaliar isotanks que chegaram em staging antes de entrarem no cadastro final.

Principais atividades:

- consultar isotanks pendentes de análise;
- revisar fornecedor, número do container, local e últimos produtos transportados;
- aprovar isotank para cadastro final;
- rejeitar isotank com comentário;
- registrar responsável pela análise.

### 4.3 Gestor ou coordenador operacional

Responsável por acompanhar a situação geral da operação.

Principais atividades:

- visualizar indicadores no dashboard;
- identificar quantidade de isotanks disponíveis;
- acompanhar pedidos abertos, pré-reservas e confirmações;
- monitorar itens pendentes em staging;
- direcionar ações para equipe operacional.

### 4.4 Administrador SharePoint ou responsável pela solução

Responsável por manter a estrutura da aplicação no SharePoint.

Principais atividades:

- publicar o pacote SPFx no App Catalog;
- criar e manter as listas SharePoint necessárias;
- controlar permissões;
- garantir que campos, nomes de listas e páginas estejam corretos;
- apoiar homologação, atualização e rollback.

## 5. Estrutura da aplicação no SharePoint

A aplicação é composta por webparts modernas do SharePoint. Cada webpart representa uma tela ou área funcional.

As principais telas são:

1. Dashboard de Isotanks.
2. Alocação de Isotanks.
3. Aprovação de Isotanks.

Cada uma pode ser adicionada a uma página moderna do SharePoint. Em um cenário recomendado, essas webparts podem estar em uma única página operacional ou em páginas separadas por perfil de usuário.

## 6. Tela: Dashboard de Isotanks

### 6.1 Objetivo da tela

O Dashboard de Isotanks oferece uma visão consolidada da operação.

Ele serve para responder rapidamente:

- quantos isotanks existem no cadastro final;
- quantos estão disponíveis;
- quantos pedidos estão abertos;
- quantos pedidos estão pré-reservados;
- quantos pedidos estão confirmados;
- quantos itens estão aguardando análise em staging.

### 6.2 Como é usado

O usuário acessa a página do dashboard e visualiza cartões de indicadores. A tela também apresenta alertas quando há pedidos aguardando alocação ou itens pendentes de aprovação.

O botão de atualização permite recarregar os dados das listas SharePoint.

### 6.3 Informações exibidas

Indicadores principais:

- Isotanks disponíveis.
- Total de isotanks cadastrados.
- Pedidos abertos.
- Pré-reservas.
- Pedidos confirmados.
- Itens aguardando aprovação.

Alertas operacionais:

- pedidos que ainda precisam de isotank;
- isotanks em staging aguardando análise;
- indicação de ausência de pendências quando aplicável.

### 6.4 Usuários principais

- Gestores operacionais.
- Coordenadores.
- Analistas que precisam priorizar ações.

## 7. Tela: Alocação de Isotanks

### 7.1 Objetivo da tela

A tela de Alocação de Isotanks apoia o processo de selecionar um isotank disponível e compatível para atender um pedido de reserva.

Ela evita que a escolha seja feita apenas manualmente, pois filtra isotanks compatíveis com o produto solicitado.

### 7.2 Como é usado

O fluxo típico é:

1. O usuário acessa a tela de Alocação.
2. A aplicação lista pedidos com status `Solicitado`.
3. O usuário escolhe um pedido.
4. A aplicação busca isotanks disponíveis compatíveis com o produto solicitado.
5. O usuário escolhe um isotank.
6. A aplicação solicita confirmação da pré-reserva.
7. Após confirmação, o isotank fica marcado como reservado e o pedido fica pré-reservado.

### 7.3 Informações exibidas sobre pedidos

A lista de pedidos pode exibir:

- número ou título do pedido;
- cliente;
- produto solicitado;
- quantidade solicitada;
- data de necessidade;
- status da reserva.

### 7.4 Informações exibidas sobre isotanks compatíveis

A lista de isotanks compatíveis pode exibir:

- identificador do isotank;
- número do container;
- fornecedor;
- local atual;
- produtos aprovados ou compatíveis;
- status de disponibilidade.

### 7.5 Resultado da ação de pré-reserva

Quando uma pré-reserva é confirmada:

- o isotank selecionado passa a ficar reservado;
- o pedido passa de `Solicitado` para `Pré-Reservado`;
- o vínculo entre pedido e isotank é registrado;
- o responsável pela reserva pode ser registrado.

### 7.6 Usuários principais

- Equipe de alocação.
- Planejamento operacional.
- Responsáveis por atendimento de pedidos.

## 8. Tela: Aprovação de Isotanks

### 8.1 Objetivo da tela

A tela de Aprovação de Isotanks é usada para analisar itens em staging antes de movê-los para o cadastro final.

O staging funciona como uma área de triagem. Um isotank pode chegar com dados preliminares e precisa ser aprovado tecnicamente antes de ser considerado disponível para uso.

### 8.2 Como é usado

O fluxo típico é:

1. O analista acessa a tela de Aprovação.
2. A aplicação lista isotanks em staging.
3. O analista abre um item para análise.
4. O analista revisa dados como fornecedor, container, local e últimos produtos.
5. O analista pode aprovar ou rejeitar.
6. Se aprovado, o isotank é criado no cadastro final.
7. Se rejeitado, o item permanece marcado com status de rejeição e comentário.

### 8.3 Informações analisadas

A análise pode considerar:

- identificador do isotank;
- número do container;
- fornecedor;
- local atual;
- últimos produtos transportados;
- status de tratamento;
- comentário do analista;
- responsável pela análise.

### 8.4 Resultado da aprovação

Quando um item é aprovado:

- ele passa a compor o cadastro final de isotanks;
- recebe status de disponibilidade inicial como `Disponível`;
- pode passar a ser considerado em processos de alocação;
- deixa de ser tratado apenas como item de staging.

### 8.5 Resultado da rejeição

Quando um item é rejeitado:

- o status de tratamento é atualizado;
- o comentário do analista registra o motivo ou observação;
- o responsável pela análise é registrado;
- o item não entra no cadastro final como isotank disponível.

### 8.6 Usuários principais

- Analistas técnicos.
- Responsáveis por qualidade, cadastro ou validação operacional.
- Usuários com permissão para aprovar ou rejeitar itens de staging.

## 9. Tipos de dados usados pela solução

A solução trabalha com cinco grupos principais de dados.

### 9.1 Isotanks aprovados

Representam os equipamentos disponíveis ou cadastrados oficialmente.

Dados típicos:

- identificador;
- número do container;
- fornecedor;
- local atual;
- status técnico final;
- status de disponibilidade;
- produtos canônicos aprovados;
- escopo de aprovação;
- pedido reservado, quando houver;
- responsável pela reserva, quando houver.

### 9.2 Isotanks em staging

Representam isotanks ainda em triagem ou análise.

Dados típicos:

- identificador;
- fornecedor;
- número do container;
- local atual;
- últimos produtos transportados;
- status de tratamento;
- analista responsável;
- data de análise;
- comentário do analista.

### 9.3 Pedidos de reserva

Representam demandas de uso de isotank.

Dados típicos:

- número ou título do pedido;
- linha de reserva;
- cliente;
- produto solicitado;
- quantidade solicitada;
- data de necessidade;
- solicitante;
- status da reserva;
- isotank reservado;
- observações;
- motivo de rejeição ou cancelamento;
- aprovador.

### 9.4 Fornecedores

Representam empresas ou origens associadas aos isotanks.

Dados típicos:

- nome do fornecedor;
- código do fornecedor;
- status ativo/inativo;
- contato;
- e-mail;
- telefone.

### 9.5 Produtos de referência

Representam a base padronizada de produtos usada para compatibilidade e normalização.

Dados típicos:

- código ou título do produto;
- alias do produto;
- nome canônico;
- grupo de produto;
- status ativo/inativo;
- percentual mínimo de similaridade;
- observação técnica.

## 10. Status usados no processo

### 10.1 Status de reserva

Os pedidos podem seguir os seguintes estados:

| Status | Significado |
|---|---|
| Solicitado | Pedido criado e aguardando alocação |
| Pré-Reservado | Isotank selecionado e bloqueado para o pedido |
| Confirmado | Reserva aprovada ou confirmada |
| Cancelado | Reserva cancelada |
| Rejeitado | Reserva rejeitada |
| Expirado | Reserva vencida ou não aproveitada dentro do prazo |

### 10.2 Status de disponibilidade do isotank

Os isotanks podem seguir os seguintes estados:

| Status | Significado |
|---|---|
| Disponível | Pode ser usado em uma nova alocação |
| Reservado | Está bloqueado para um pedido |
| Indisponível | Não pode ser usado no momento |
| Em Uso | Está em operação |
| Manutenção | Está em manutenção |

## 11. Jornada operacional completa

Uma jornada completa de uso pode seguir esta sequência:

1. Um isotank novo ou atualizado entra na lista de staging.
2. Um analista técnico avalia o item na tela de Aprovação.
3. Se aprovado, o isotank entra no cadastro final como disponível.
4. Um pedido de reserva é criado com produto, cliente e data de necessidade.
5. O operador acessa a tela de Alocação.
6. O operador seleciona o pedido solicitado.
7. A aplicação mostra isotanks disponíveis compatíveis com o produto.
8. O operador escolhe um isotank e confirma a pré-reserva.
9. O pedido fica pré-reservado e o isotank fica reservado.
10. O gestor acompanha indicadores e pendências no Dashboard.

## 12. Regras de negócio esperadas

A solução considera as seguintes regras funcionais:

- apenas pedidos solicitados devem aparecer para alocação inicial;
- apenas isotanks disponíveis devem ser considerados para pré-reserva;
- o produto solicitado deve ser compatível com os produtos aprovados do isotank;
- um isotank pré-reservado deve deixar de ser tratado como disponível;
- itens de staging precisam ser aprovados antes de entrarem no cadastro final;
- rejeições devem ser acompanhadas de comentário ou justificativa operacional;
- indicadores devem refletir o estado das listas SharePoint.

## 13. Permissões e governança

A aplicação depende das permissões do SharePoint.

Recomenda-se separar permissões por perfil:

| Perfil | Permissões recomendadas |
|---|---|
| Gestor | Leitura nas listas e acesso ao dashboard |
| Operador de alocação | Leitura em isotanks/produtos/pedidos e edição nos registros de reserva |
| Analista de aprovação | Leitura em staging e edição/aprovação de itens de staging e cadastro final |
| Administrador | Controle total das listas, páginas e pacote SPFx |

A solução não substitui a governança do SharePoint. Ela usa as permissões já configuradas no site e nas listas.

## 14. Dados mestres e qualidade da informação

A qualidade da aplicação depende da qualidade dos dados cadastrados.

Pontos críticos:

- nomes de produtos devem ser padronizados;
- fornecedores devem estar ativos quando aplicável;
- status devem usar valores consistentes;
- pedidos devem conter produto solicitado;
- isotanks devem ter produtos aprovados/canônicos preenchidos;
- staging deve conter informações suficientes para análise.

## 15. Implantação no SharePoint

A solução é publicada como pacote SPFx no App Catalog do SharePoint.

Depois de publicada, as webparts podem ser adicionadas a páginas modernas do SharePoint.

Antes de publicar em produção, recomenda-se validar:

- criação das listas necessárias;
- existência dos campos esperados;
- permissões por perfil de usuário;
- geração do pacote `.sppkg`;
- smoke test em site de homologação;
- plano de rollback.

## 16. Listas SharePoint necessárias

A solução espera as seguintes listas:

| Lista | Finalidade |
|---|---|
| Cadastro_Final_Isotanks | Cadastro oficial dos isotanks aprovados |
| iso_staging | Área de triagem e aprovação técnica |
| Pedidos_Reservas | Pedidos de reserva e alocação |
| iso_Fornecedores | Cadastro de fornecedores |
| iso_produtos_ref | Base de produtos de referência |

## 17. Indicadores de sucesso da solução

A solução é bem-sucedida quando:

- a equipe consegue visualizar disponibilidade de isotanks com clareza;
- pedidos solicitados são alocados com menor esforço manual;
- isotanks incompatíveis não são selecionados por engano;
- itens de staging são aprovados ou rejeitados com rastreabilidade;
- gestores conseguem acompanhar pendências e volume operacional;
- a operação deixa de depender exclusivamente de planilhas ou mensagens avulsas.

## 18. Limitações atuais conhecidas

A solução atual depende de listas SharePoint previamente criadas.

Ela não automatiza, por si só:

- criação inicial das listas;
- criação automática de colunas;
- integração externa com ERP ou sistemas logísticos;
- notificações automáticas por e-mail ou Teams;
- fluxo formal de aprovação via Power Automate;
- trilha de auditoria avançada separada.

Esses pontos podem ser evoluções futuras.

## 19. Evoluções futuras recomendadas

Possíveis evoluções:

- provisionamento automático de listas e colunas;
- fluxo de aprovação com Power Automate;
- notificações para pedidos pendentes;
- histórico/audit trail de reservas e aprovações;
- tela de inventário detalhada;
- módulo de confirmação e cancelamento de reservas;
- integração com dados externos de pedidos ou logística;
- relatórios gerenciais adicionais.

## 20. Resumo executivo

A solução Isotanks é uma aplicação SharePoint para controlar o ciclo operacional de isotanks: triagem, aprovação, cadastro final, disponibilidade, pedidos, pré-reserva e acompanhamento gerencial.

Ela organiza informações que normalmente ficariam dispersas em listas, planilhas ou comunicações manuais, oferecendo telas específicas para cada etapa do processo.

O resultado esperado é maior rastreabilidade, menor risco de erro na alocação, melhor visibilidade operacional e mais padronização na gestão de isotanks.
