# Tempo 86 - Smart Order Management (Front-end & Desktop App)

O **Tempo 86** é um sistema moderno de gerenciamento de pedidos e tempos de preparo (KDS - Kitchen Display System), projetado para entregar alta performance e uma interface de usuário incrível.

🔗 **Repositório do Back-end (API & Banco de Dados):** [Link para o Back-end / SmartOrderManagement.API](../SmartOrderManagement.API)

## 🏗️ Sobre este Repositório (Front-end)

Este repositório contém a aplicação principal focada em **Interface de Usuário** e **Empacotamento Desktop**. 

A stack tecnológica utilizada aqui é dividida em duas partes principais:

1. **Front-end (Interface Visual):**
   * Construído com **Angular 18+** e **Tailwind CSS**.
   * Design totalmente responsivo, moderno e focado em experiência do usuário (UX).
   * Gerencia estado, timers em tempo real e popups usando `sweetalert2`.

2. **Empacotador Nativo (Tauri):**
   * Desenvolvido em **Rust**.
   * O Tauri atua como a ponte (o *Shell*) do sistema, transformando a nossa aplicação Web em um poderoso aplicativo `.exe`.
   * Quando o usuário abre o aplicativo, o Tauri exibe a interface do Angular e inicializa automaticamente a API de Back-end (arquitetura *Sidecar*) em segundo plano, desligando tudo de forma segura ao fechar o programa.

## 🚀 Como Desenvolver Localmente

Se você for dar manutenção neste código (Front-end), siga os passos abaixo:

### Pré-requisitos
* Node.js e npm instalados.
* Rust e os requisitos de compilação do Tauri instalados.

### Rodando o projeto na Web
Para desenvolver e testar direto no navegador:
```bash
ng serve
```
*(Acesse http://localhost:4200. Lembre-se de rodar a API do Back-end em paralelo)*.

### Rodando o aplicativo Desktop Nativo (Tauri)
Para testar como se fosse o usuário final (janela nativa do Windows):
```bash
npm run tauri dev
```
*(Certifique-se de que o executável da API já foi colocado na pasta `src-tauri/binaries/` para o Sidecar funcionar).*

## 📦 Como gerar o Executável Final (.exe / .msi)

Para gerar uma versão oficial de distribuição para o cliente:

1. Compile o back-end e coloque o executável `.exe` na pasta `binaries` (conforme instruções no README do Back-end).
2. Rode o gerador do Tauri neste repositório:
   ```bash
   npm run tauri build
   ```
O instalador final `.msi` ficará disponível na pasta `src-tauri/target/release/bundle/msi/`. É só enviar esse arquivo para o cliente!
