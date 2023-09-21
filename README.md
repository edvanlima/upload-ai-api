```bash
mkdir upload-ai-api
cd upload-ai-api
npm init
```

## Dependencies

```bash
npm i typescript @types/node tsx -D
```

### Rotas

```bash
npm i fastify
```

### Extensions

- rest client

### Database

```bash
npm i prisma -D
npx prisma init --datasource-provider sqlite
npx prisma migrate dev
npx prisma studio
```
