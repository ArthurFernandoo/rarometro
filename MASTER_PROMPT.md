# PROMPT MESTRE — RARÔMETRO / ENTREVISTA COM HIGURUMA

Leia os arquivos atuais antes de editar. Preserve a lógica que funciona e faça alterações incrementais. Não recrie o projeto do zero sem necessidade.

## Conceito

Crie e mantenha o **RARÔMETRO**, uma experiência de entretenimento em português brasileiro conduzida por Hiromi Higuruma, personagem de *Jujutsu Kaisen*. É um fan project não oficial. Use as três imagens locais em `assets/` fornecidas pelo usuário como referências visuais. Não busque imagens remotas obrigatórias: o site precisa funcionar estático e offline depois de carregar os arquivos. Não copie falas exatas da obra; escreva falas originais compatíveis com uma personalidade cansada, analítica, de humor seco, geralmente contida e capaz de demonstrar intensidade quando algo realmente o atinge.

## Layout e ritmo

- O retrato do entrevistador fica em destaque, no topo da tela de entrevista. A pergunta e as alternativas ficam abaixo dele.
- O diálogo deve ser legível e visível; não esconda as falas em painéis laterais pequenos.
- Não mostre uma barra numérica de tédio ou interesse. Mostre o humor por expressão, postura, pequenos movimentos, observações corporais e falas.
- Reaja imediatamente quando uma alternativa é selecionada, antes de confirmar a resposta. Confirmar salva a resposta e avança.
- Use os retratos e transições CSS para estados como cansado, neutro, curioso, impressionado, atento ao caso e sobrecarregado. O estado normal não deve parecer constantemente acusatório.
- Interface responsiva para desktop e celular, sem rolagem horizontal, com foco por teclado e respeito a `prefers-reduced-motion`.

## Banco de perguntas e RNG

O catálogo total deve conter 40 questões: 39 comuns mais a questão de superpoderes. Em cada sessão:

1. Sorteie sete perguntas comuns sem repetição: duas de hábitos, duas de curiosidade, uma de interesses e duas de criatividade.
2. Inclua sempre a pergunta de superpoderes.
3. Embaralhe a ordem das oito perguntas e a ordem das alternativas de cada questão.
4. Mostre os acompanhamentos narrativos imediatamente depois da pergunta de superpoderes se o usuário escolher invisibilidade + parar o tempo.
5. Mantenha o banco no JavaScript local; não invente uma dependência de banco remoto, servidor ou API.

A aleatoriedade varia a entrevista, não sorteia a pontuação. A mesma combinação de perguntas e respostas deve produzir o mesmo índice. Escreva perguntas sobre rotina, preferências, interesses, curiosidade e criatividade com opções igualmente legítimas. Não trate respostas comuns como suspeitas nem transforme todo questionário em interrogatório moral. A suspeita pertence somente à rota narrativa especial.

## Pontuação e resultados

- Índice lúdico de 0 a 100, baseado em pesos e tags definidos no código.
- Quatro dimensões explicadas como indicadores de entretenimento, nunca como diagnóstico psicológico nem como medida real de raridade populacional.
- Reconheça padrões entre respostas apenas quando as tags e respostas anteriores sustentarem a observação.
- O relatório normal tem categoria, descrição, fala final contextual, mapa das dimensões e compartilhamento.
- A rota secreta exige o par invisibilidade + parar o tempo e três respostas complementares; o par isolado não determina o final.
- Se a suspeita atingir o limiar, mostrar “CLASSIFICAÇÃO NÃO EMITIDA” e não exibir nota, categoria, gauge ou score escondido em outra parte da tela.
- Se não atingir o limiar, emitir o resultado normal com uma observação de que a hipótese foi reconsiderada ou permanece inconclusiva.

## Estrutura de dados e navegação

Mantenha `historyStack` como uma pilha JavaScript real. Ao confirmar resposta, use `push`; ao voltar, use `pop`, remova a resposta correspondente e restaure a seleção. Se a pergunta de superpoderes for alterada, descarte respostas complementares que deixaram de ser válidas. A pontuação e as dimensões precisam usar somente as perguntas válidas daquela sessão.

## Tecnologias e publicação

Use HTML, CSS e JavaScript estáticos. Todos os assets ficam em `assets/`; nenhuma imagem pode depender de URLs temporárias. O projeto deve publicar no Netlify com comando de build vazio e diretório `.`. Mantenha um README honesto sobre o RNG, a pontuação, a pilha, os testes e a ausência de backend.

## Testes obrigatórios

Teste início, oito perguntas sem repetição, mudança na ordem de perguntas e alternativas, seleção obrigatória, voltar, seleção de até dois superpoderes, inserção das três perguntas condicionais, os dois tipos de final, reinício, compartilhamento e layout mobile. Verifique erros de JavaScript antes de declarar a entrega pronta.
