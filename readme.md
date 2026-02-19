# Sistema de Validação de PN

Sistema web para validação de Part Numbers (PN) em processos de expedição, comparando dados de Nota Fiscal com etiquetas de produção e expedição.

## 🛠️ Tecnologias

- **Frontend:** React 18, React-Bootstrap, Bootstrap 5, Font Awesome
- **Backend:** Node.js, Express
- **Banco de dados:** SQLite3
- **Outros:** Axios, dotenv, concurrently

## 📋 Pré-requisitos

- Node.js >= 14.x
- npm >= 6.x

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd sistema-validacao-react
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações:
   ```env
   PORT=3001
   REACT_APP_API_URL=http://localhost:3001
   ```

## ▶️ Executando o projeto

### Desenvolvimento (frontend + backend simultâneos)
```bash
npm run dev
```

### Apenas o servidor (backend)
```bash
npm run server
```

### Apenas o frontend
```bash
npm start
```

### Build de produção
```bash
npm run build
```
Após o build, o servidor Express servirá os arquivos estáticos automaticamente.

## 📁 Estrutura do Projeto

```
├── public/               # Arquivos públicos do React
├── src/
│   ├── components/       # Componentes React
│   │   └── Modais/       # Modais (Histórico, Logs, Sucesso, Erro, Sobre)
│   ├── hooks/            # Custom hooks (useValidacao)
│   ├── services/         # Serviços de API, banco de dados e logger
│   ├── utils/            # Utilitários (validadores e formatadores)
│   ├── App.js            # Componente principal
│   ├── index.js          # Entry point React
│   └── index.css         # Estilos globais
├── logs/                 # Logs gerados pelo sistema
├── server.js             # Servidor Express (API + static files)
├── ValidacaoPN.db        # Banco de dados SQLite (gerado automaticamente)
├── .env.example          # Exemplo de variáveis de ambiente
└── package.json
```

## ⚙️ Funcionalidades

- Leitura e validação de dados de Nota Fiscal
- Comparação de etiquetas de produção e expedição com a NF
- Registro histórico de validações com data, hora e usuário
- Visualização de logs do sistema em tempo real
- Geração de etiquetas de expedição
- Interface responsiva com feedback visual de sucesso/erro

## 🗄️ Banco de Dados

O banco de dados SQLite (`ValidacaoPN.db`) é criado automaticamente na raiz do projeto na primeira execução. Armazena o histórico de todas as validações realizadas.

## 📄 Logs

Os logs do sistema são gravados em `logs/sistema_validacao.log` com timestamp no fuso horário de Brasília (America/Sao_Paulo).