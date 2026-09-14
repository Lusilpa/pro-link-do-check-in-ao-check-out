# Pro-Link (Do check-in ao check-out)

Este é o repositório frontend do projeto Pro-Link.

## 🚀 Fluxo de Execução (Como rodar o projeto)

O projeto utiliza **Docker** para garantir que a aplicação seja executada corretamente no navegador, sem bloqueios de política de segurança (CORS) causados por requisições locais (AJAX/jQuery).

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na sua máquina.

### Passos para rodar a aplicação localmente

1. Abra o terminal na raiz do projeto (onde está o arquivo `docker-compose.yml`).
2. Execute o comando para construir e subir os containers (servidor web e banco de dados):
   ```bash
   docker-compose up -d
   ```
3. Acesse o sistema através do seu navegador no endereço:
   👉 **http://localhost:8081**

> **⚠️ IMPORTANTE:** Nunca abra o arquivo `public/index.html` clicando diretamente nele (no formato `file:///`). O navegador irá bloquear o carregamento dinâmico dos componentes HTML (NavBar, Sidebars, Templates) e a tela não funcionará como o esperado. Utilize sempre o servidor local pelo Docker.

### Estrutura de Serviços
- **Aplicação Web (Frontend):** Porta `8081` (Apache + PHP 8.2 mapeando a pasta `/public`)
- **Banco de Dados:** Porta `3307` (MariaDB 10.11 - Container local)

---

## 👥 Equipe

| Nome | Função |
|---|---|
| Arielle Silva Tavares | Teste/QA |
| Felipe André Freire Trindade | Backend |
| Hanna Nunes Reis | Backend |
| Luan da Silva Palma | Engenharia de Dados e Front-end |
| Luis Rogerio Cavalcante de Melo | Segurança da Informação |

## 📄 Licença

Copyright (c) 2026 Equipe Otho. Todos os direitos reservados.

Este projeto foi desenvolvido no âmbito do Desafio Pro-Link (Edital n° 03/2026 - CREA / AM) e está sujeito aos termos de propriedade intelectual e exclusividade previstos no edital.