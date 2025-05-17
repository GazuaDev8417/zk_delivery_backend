# zk-delivery 🚚🔐

**Privacidade em Logística com Provas de Conhecimento Zero**

O `zk-delivery` é um projeto full-stack com foco em **privacidade na entrega de produtos** usando **Zero-Knowledge Proofs (ZKPs)**. Utiliza tecnologias como **Circom**, **snarkjs**, **zkverifyjs** e **React.js**, com potencial de aplicação no futuro da logística com drones e automação.

---

## 💡 Visão do Projeto

Imagine um cenário onde:
- Um **cliente faz um pedido** e recebe um **código secreto**.
- Esse código é transformado em um **hash Poseidon** e salvo com o **endereço da entrega** (criptografado ou não).
- O **entregador (ou drone)** apresenta uma **prova ZK** de que conhece o código, **sem revelar o código em si**.
- O sistema valida a prova. Se for válida, o sistema revela **apenas o endereço**.

Resultado: **nenhum dado pessoal exposto**, nenhuma fraude, entrega garantida com segurança e privacidade.

---

## 🌐 Tecnologias Aplicadas

| Tecnologia     | Uso no Projeto                                |
|----------------|-------------------------------------------------|
| Circom         | Escrita do circuito ZK para validação do código  |
| snarkjs        | Geração de provas ZK com o circuito             |
| zkverifyjs     | Verificação de provas via API zkVerify          |
| React.js       | Frontend para interação do entregador/cliente    |
| Nodejs         | Backend para orquestração e API REST             |

---

## 🚀 Como Funciona

1. O **cliente** envia o hash do código e o endereço ao sistema.
2. O **entregador** recebe apenas o código.
3. O entregador gera uma **prova zkSNARK** com `snarkjs`.
4. O sistema envia a prova para o zkVerify, que responde se é válida.
5. Se a prova for válida, o sistema revela o **endereço exato da entrega**.

---

## 🧠 Visão Estratégica

O modelo zk-delivery se encaixa diretamente no futuro da logística com **drones autônomos**, onde:
- Drones precisam receber apenas o essencial (endereço)
- Nenhum nome, CPF, ou informação sensível é exposto
- Provas ZK garantem que o drone não erra nem vaza informações

Essa arquitetura se alinha com as tendências de **LGPD, GDPR**, e automação descentralizada (Web3).

---

## 🌍 Potencial de Aplicação Empresarial

- Empresas de entrega autônoma por drone
- Plataformas de e-commerce com foco em segurança de dados
- Entregas confidenciais: saúde, jurídico, finanças
- Sistemas internos de logística com acesso restrito à informação

---

## ✅ Contribuição
Pull requests e ideias são bem-vindas para evoluir o zk-delivery em direção a um protocolo real para logística segura e privada.

---

Feito com ❤️ por Paulo Santos.

