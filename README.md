# RARÔMETRO — Entrevista de Singularidade

O **RARÔMETRO** é uma experiência interativa de entretenimento em português brasileiro. Hiromi Higuruma, de *Jujutsu Kaisen*, conduz uma entrevista curta e reage às respostas com expressões, observações sobre a linguagem corporal e falas originais. Esta é uma experiência de fã, não oficial e sem afiliação aos titulares da obra.

A sessão normal apresenta oito perguntas: sete são sorteadas de um acervo de 39 questões comuns, seguindo cotas por categoria, e uma pergunta de superpoderes é sempre incluída. A combinação de invisibilidade com parar o tempo pode abrir três perguntas complementares e um final secreto. A escolha dos superpoderes não decide o final por conta própria.

> O índice de 0 a 100 é uma pontuação lúdica definida pelas regras do projeto. Não mede raridade estatística real, não é uma avaliação psicológica e não consulta bancos populacionais.

## Funcionalidades

- Banco local com 40 perguntas, em categorias de hábitos, curiosidade, interesses e criatividade, além da questão de superpoderes.
- Sorteio de sete perguntas comuns por sessão, com cotas para manter variedade; ordem das perguntas e das alternativas também aleatória.
- Pontuação determinística para a combinação específica de perguntas e respostas da sessão. O RNG escolhe o conteúdo e a ordem, não sorteia a nota.
- Retratos fornecidos pelo usuário que mudam entre expressão cansada, reação intensa e sobrecarga, com animações CSS e falas originais.
- Reação visual imediata ao selecionar uma alternativa, antes de confirmar.
- Falas que podem reconhecer padrões entre respostas diferentes, sem tratar as perguntas cotidianas como suspeitas.
- Rota narrativa especial ativada apenas pela combinação invisibilidade + parar o tempo, com três perguntas de acompanhamento e um final secreto sem nota se o limiar de suspeita for atingido.
- Sistema de Combos Dinâmicos: combinações específicas de escolhas (como Auditoria de Sistema / Metagamer, Arquiteto do Caos e Cidadão Absolutamente Comum) acionam banners em tempo real, inserem averiguações personalizadas que alteram o rumo do teste e geram vereditos exclusivos de Higuruma.
- Resultado comum com pontuação, categoria, dimensões, observação final e compartilhamento.
- Pilha JavaScript (`historyStack`) para voltar e editar a resposta anterior.
- Layout responsivo, suporte a `prefers-reduced-motion`, sem cadastro, backend, API ou envio de respostas para servidor.

## Executar localmente

O projeto não precisa de build. Extraia a pasta e abra `index.html`. Para testar usando um servidor local, abra um terminal dentro da pasta e execute:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Publicar no Netlify

1. Envie **todos os arquivos e a pasta `assets/`** para a raiz do repositório GitHub, ou arraste a pasta extraída para o Netlify Drop.
2. Se importar pelo GitHub, deixe o comando de build vazio e use `.` como diretório de publicação.
3. Abra a URL pública em desktop e celular, e execute os testes abaixo.

## Arquivos

- `index.html`: telas da página inicial, entrevista, relatório normal e final secreto.
- `styles.css`: layout, retratos, transições, estados visuais e responsividade.
- `app.js`: banco de questões, RNG, respostas, pontuação, estados narrativos, pilha de navegação e compartilhamento.
- `assets/`: três imagens de referência fornecidas pelo usuário.
- `MASTER_PROMPT.md`: requisitos atuais para continuar o projeto no Antigravity.
- `CHANGELOG.md`: resumo das alterações desta edição.

## Como funciona o RNG

O acervo tem 39 perguntas comuns distribuídas entre quatro categorias e uma pergunta de superpoderes. Cada sessão sorteia duas perguntas de hábitos, duas de curiosidade, uma de interesses e duas de criatividade, adiciona a pergunta de superpoderes e embaralha a ordem. As alternativas de cada pergunta também são embaralhadas. A rota complementar só aparece se o par específico de superpoderes for escolhido.

A pontuação normaliza os pontos das alternativas e considera regras de combinação por tags. Repetir exatamente o mesmo conjunto de perguntas e respostas produz o mesmo resultado. Como cada sessão pode selecionar perguntas diferentes, responder sempre na posição A não produz necessariamente a mesma nota de outra sessão.

## Pilha de navegação

`historyStack` é um array JavaScript que funciona como pilha LIFO (*last in, first out*). Ao confirmar uma resposta, o código executa `push(...)`. Ao voltar, executa `pop()`, remove a resposta correspondente e reabre a pergunta com a seleção restaurada. A pilha controla a navegação real da aplicação, não é apenas uma demonstração teórica.

## Checklist de testes

- [ ] A página inicial e o botão de início funcionam.
- [ ] Cada sessão contém oito perguntas principais e não repete perguntas.
- [ ] Perguntas e alternativas mudam de ordem entre sessões.
- [ ] Não é possível avançar sem selecionar uma resposta.
- [ ] Voltar restaura a pergunta anterior e a seleção feita.
- [ ] Na questão de superpoderes, é possível marcar até duas opções.
- [ ] Invisibilidade + parar o tempo inserem três perguntas complementares depois da questão de superpoderes.
- [ ] Respostas complementares podem resultar tanto em relatório normal quanto em final secreto.
- [ ] O final secreto não mostra número, categoria ou barra de pontuação.
- [ ] O índice permanece entre 0 e 100 e é reprodutível para as mesmas perguntas/respostas.
- [ ] O resultado comum mostra quatro dimensões e o botão de compartilhar funciona quando o navegador oferece suporte.
- [ ] O site funciona no celular, sem rolagem horizontal.
- [ ] A URL publicada no Netlify abre em outro dispositivo.

## Limitações e transparência

O banco de perguntas fica no próprio JavaScript, não é uma base de dados externa nem um serviço de IA. Os pesos ficam visíveis para quem inspecionar o código. O estado só existe na memória da página; atualizar o navegador começa uma sessão nova. A aparência usa imagens de referência fornecidas pelo usuário e não é uma representação oficial licenciada pela franquia.
