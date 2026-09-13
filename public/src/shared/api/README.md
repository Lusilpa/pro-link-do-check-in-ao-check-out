# shared/api — Camada de Serviços de API

> Todos os contratos com o back-end vivem aqui. Nenhuma entidade deve conter `fetch()` diretamente.

---

## Estrutura

```
shared/api/
├── _http.js            ← HTTP Client base (apiRequest, getAuthHeaders)
├── auth.js             ← Autenticação: login, cadastro, OAuth, logout, recuperação de senha
├── demands.js          ← Demandas: listar, buscar, criar, atualizar, excluir, expressar interesse
├── feed.js             ← Feed: listar posts, criar, curtir, comentar
├── correio.js          ← Caixa de Correio: inbox, ler, enviar, excluir, marcar como lido
└── talentos.js         ← Talentos: listar, buscar por ID, salvar/favoritar
```

---

## Regra de Dependência

```
_http.js
    └── demands.js      (depende de apiRequest)
    └── feed.js         (depende de apiRequest)
    └── correio.js      (depende de apiRequest + API_BASE_URL para FormData)
    └── talentos.js     (depende de apiRequest)

auth.js                 ← independente (carregado antes de _http.js nas páginas de auth)
```

---

## Ordem de `<script>` nas páginas que usam a API

**Páginas da aplicação** (ex: `#feed`, `#cartas`, `#demandas`):
```html
<script src="src/shared/api/_http.js"></script>
<script src="src/shared/api/demands.js"></script>   <!-- se usar -->
<script src="src/shared/api/feed.js"></script>       <!-- se usar -->
<script src="src/shared/api/correio.js"></script>    <!-- se usar -->
<script src="src/shared/api/talentos.js"></script>   <!-- se usar -->
```

**Páginas de autenticação** (login, cadastro, recuperação de senha):
```html
<script src="src/shared/api/auth.js"></script>
```

---

## Padrão de Fallback

Todos os serviços implementam **fallback automático com dados sintéticos** enquanto o back-end não está disponível. O padrão é:

```js
async function fetchRecurso() {
    try {
        return await apiRequest('/endpoint');
    } catch (error) {
        console.warn('[Pro-Link API] Offline. Usando dados sintéticos:', error.message);
        return MOCK_DATA;
    }
}
```

Quando o back-end for integrado, basta remover o `catch` ou o bloco mock.

---

## Endpoints esperados no Back-end

| Serviço | Método | Endpoint |
|---|---|---|
| Auth | POST | `/api/auth/login` |
| Auth | POST | `/api/auth/register` |
| Auth | POST | `/api/auth/recover-password` |
| Auth | GET | `/api/auth/google` |
| Auth | GET | `/api/auth/linkedin` |
| Demands | GET | `/api/demands` |
| Demands | GET | `/api/demands/:id` |
| Demands | POST | `/api/demands` |
| Demands | PUT | `/api/demands/:id` |
| Demands | DELETE | `/api/demands/:id` |
| Demands | POST | `/api/demands/:id/interest` |
| Feed | GET | `/api/feed/posts` |
| Feed | POST | `/api/feed/posts` |
| Feed | POST | `/api/feed/posts/:id/like` |
| Feed | POST | `/api/feed/posts/:id/comments` |
| Correio | GET | `/api/correio/inbox` |
| Correio | GET | `/api/correio/:id` |
| Correio | POST | `/api/correio/send` |
| Correio | PATCH | `/api/correio/:id/read` |
| Correio | DELETE | `/api/correio/:id` |
| Talentos | GET | `/api/talentos` |
| Talentos | GET | `/api/talentos/:id` |
| Talentos | POST | `/api/talentos/:id/save` |
