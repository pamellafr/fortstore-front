# FortStore - Frontend

Interface web para loja virtual de cosmeticos do Fortnite desenvolvida em Vue.js 3.

## Tecnologias Utilizadas

- Vue.js 3
- Vue Router
- Pinia (gerenciamento de estado)
- Axios (requisicoes HTTP)
- Date-fns (formatacao de datas)
- Vue CLI

## Requisitos

- Node.js 18 ou superior
- npm ou yarn

## Instalacao

1. Clone o repositorio:
```bash
git clone <url-do-repositorio>
cd fortstore-front
```

2. Instale as dependencias:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto:
```
VUE_APP_API_URL=http://localhost:8000
```

Se estiver usando Docker/Sail, ajuste a URL conforme necessario:
```
VUE_APP_API_URL=http://172.18.128.1:80
```

## Como Rodar

Desenvolvimento:
```bash
npm run serve
```

A aplicacao estara disponivel em: http://localhost:8080

Build de producao:
```bash
npm run build
```

## Funcionalidades

- Listagem de cosmeticos com paginacao
- Filtros por nome, tipo, raridade, data
- Filtros por novos, a venda, em promocao
- Detalhes do cosmetico
- Autenticacao de usuarios
- Compra e devolucao de cosmeticos
- Biblioteca de cosmeticos adquiridos
- Perfil do usuario com historico de compras
- Pagina publica de perfis de usuarios

## Decisoes Tecnicas

- Vue 3 com Composition API
- Pinia para gerenciamento de estado
- Composables para logica reutilizavel
- Componentes modulares e reutilizaveis
- Tratamento de erros nas requisicoes API
- Indicadores visuais para cosmeticos novos, a venda e adquiridos
