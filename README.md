# Provedor de e-mail profissional

Primeiro corte local com página pública e diagnóstico MX. A consulta
diagnostica os registros existentes. A prova de titularidade do domínio
será uma etapa separada, com desafio DNS.

Execute npm test e npm start com Node 22+. O serviço local escuta em
127.0.0.1:3000. Cadastro, pagamento, provisionamento Mailu e deploy ainda
precisam ser implementados.

O plano é um repositório privado dedicado. O GitHub Actions publica o app
por SSH com um usuário de deploy restrito. A instalação inicial do Mailu
e os dados de e-mail têm ciclo próprio, fora dos arquivos de cada release.
A VPS precisa de um domínio técnico, acesso de deploy e validação SMTP.
