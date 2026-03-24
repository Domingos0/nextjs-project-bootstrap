# Solar Intelligence Brasil

Dashboard Next.js para inteligência de mercado solar com foco em leads ativas.

## Como executar

```bash
npm install
npm run dev
```

## Integração com dados abertos (leads reais)

Defina as variáveis abaixo para habilitar ingestão automática de fontes públicas:

- `PNCP_API_URL`: endpoint JSON de oportunidades no PNCP (ou endpoint intermediário já filtrado para solar).
- `ANEEL_API_URL`: endpoint JSON/CKAN da ANEEL com empreendimentos/projetos fotovoltaicos.
- `IBGE_API_URL` (opcional): endpoint para validação adicional de municípios.
- `BNDES_API_URL` (opcional): endpoint para cruzamento com dados de financiamento.

Exemplo de `.env.local`:

```env
PNCP_API_URL=https://<seu-endpoint-pncp>
ANEEL_API_URL=https://<seu-endpoint-aneel>
IBGE_API_URL=https://servicodados.ibge.gov.br/api/v1/localidades/estados
BNDES_API_URL=https://<seu-endpoint-bndes>
```

> O painel marca como **validada** a lead que possui confirmação em múltiplas fontes + score de confiabilidade >= 70.
