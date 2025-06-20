# Aplicação para gerenciamento de usuários e produtos

O stack da aplicação é composto por orquestração com Docker do banco de dados MySQL e do backend java com Spring Boot. O frontend é desenvolvido em Angular 17. A aplicação é uma API REST que permite o gerenciamento de usuários e produtos, com autenticação JWT.

## Video da apresentação do projeto:

<https://drive.google.com/file/d/1o_qM3lbAoCE8LUloCQ5SDVquOLL0WKS6/view?usp=sharing>

## Orientação para implementação

Observação: Para implementação em produção ou homologação altere as senhas e credenciais e jwt.secret dos arquivos de configuração. Também é necessário alterar o arquivo `application.properties` do backend para apontar para o banco de dados em produção. E ajustar a configuração do CORS no `src\main\java\com\gestaoprodutos\config\SecurityConfig.java` para permitir o acesso do frontend.

### Pre-requisitos

- Docker
- Docker Compose
- Java 17
- Maven
- Node.js
- Angular CLI
- MySQL Workbench ou similar
- IDE de sua preferência (IntelliJ, Eclipse, VSCode, etc.)

### 1. Clone esse repositório

```bash
git clone https://github.com/ericodex/teste-nucleo-metropolitano.git
```

### 2. Acesse o diretório `\MySql` crie a imagem docker do banco de dados com o comando

```bash
docker build -t my-mysql .
```

```bash
docker-compose up -d
```

Acesse o MySQL Workbench ou similar com as configurações do Dockerfile e crie as tabelas com o script `create_tables.sql`.

### 3. Acesse o diretório `\backend\gestaoProdutosNucleMetropolitano` e crie a imagem docker do backend com o comando

```bash
mvn clean install
```

```bash
docker build -t gestaoprodutos-app .
```

```bash
docker-compose up -d
```

Para executar os testes das APIs do backend, execute o comando:

```bash
mvn test
```

Acesse o Swagger da aplicação em `http://localhost:13434/api/swagger-ui/index.html` para visualizar a documentação das APIs disponíveis.

### 4. Acesse o diretório `\frontend\front-gestao-produtos` e execute o comando para rodar a aplicação Angular

```bash
ng install
```

```bash
ng serve
```

Acesse a aplicação em `http://localhost:4200` para visualizar a interface do usuário.

Para rodar os testes da aplicação Angular

```bash
ng test
```
