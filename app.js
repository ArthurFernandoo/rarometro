/* RARÔMETRO — aplicação de entretenimento. Sem backend ou coleta de dados. */
'use strict';


// Questões sorteadas localmente. O RNG escolhe a amostra e a ordem, nunca inventa a nota.
function makeBankQuestion(id, categoryKey, title, description, optionTexts, weight = 0.95) {
  const categoryLabels = {
    habits: 'HÁBITOS E ROTINA', curiosity: 'CURIOSIDADE',
    interests: 'PREFERÊNCIAS E INTERESSES', creativity: 'CRIATIVIDADE E ESCOLHAS'
  };
  const profiles = {
    habits: [
      { points: 0, surprise: -2, tags: ['routine'], mood: 'dry' },
      { points: 1, surprise: 0, tags: ['flexible'], mood: 'calm' },
      { points: 3, surprise: 3, tags: ['planner', 'practical'], mood: 'curious' },
      { points: 5, surprise: 6, tags: ['improviser', 'pattern_hunter'], mood: 'amused' }
    ],
    curiosity: [
      { points: 0, surprise: -2, tags: ['routine'], mood: 'dry' },
      { points: 1, surprise: 0, tags: ['curiosity'], mood: 'calm' },
      { points: 3, surprise: 3, tags: ['researcher'], mood: 'curious' },
      { points: 5, surprise: 6, tags: ['deep_dive', 'pattern_hunter'], mood: 'impressed' }
    ],
    interests: [
      { points: 0, surprise: -2, tags: ['practical'], mood: 'dry' },
      { points: 1, surprise: 0, tags: ['stories'], mood: 'calm' },
      { points: 3, surprise: 3, tags: ['systems', 'curiosity'], mood: 'curious' },
      { points: 5, surprise: 6, tags: ['pattern_hunter', 'deep_dive'], mood: 'impressed' }
    ],
    creativity: [
      { points: 0, surprise: -2, tags: ['routine'], mood: 'dry' },
      { points: 1, surprise: 0, tags: ['idea'], mood: 'calm' },
      { points: 3, surprise: 3, tags: ['experiment'], mood: 'curious' },
      { points: 5, surprise: 6, tags: ['builder', 'experiment'], mood: 'impressed' }
    ]
  };
  const profile = profiles[categoryKey];
  return {
    id, category: categoryLabels[categoryKey], categoryKey,
    type: 'single', weight, maxPoints: 5, title, description,
    options: optionTexts.map((text, index) => ({
      id: `${id}_${String.fromCharCode(97 + index)}`, text,
      ...profile[index]
    }))
  };
}

const CORE_QUESTIONS = [
  {
    id: 'routine', category: 'HÁBITOS COTIDIANOS', categoryKey: 'habits', type: 'single', weight: 0.8, maxPoints: 5,
    title: 'Quando você finalmente tem tempo livre, o que acontece?',
    description: 'Pense no que você realmente faz quando ninguém exige nada de você.',
    options: [
      { id: 'rest', text: 'Desligo um pouco e faço algo familiar.', points: 0, surprise: -3, tags: ['routine'], reaction: 'Uma estratégia de descanso. A humanidade depende disso.' },
      { id: 'choose', text: 'Procuro algo que me interesse na hora.', points: 1, surprise: -1, tags: ['flexible'], reaction: 'Flexibilidade. Um clássico respeitável.' },
      { id: 'rabbit_hole', text: 'Começo pesquisando uma coisa e termino em outra completamente diferente.', points: 3, surprise: 3, tags: ['deep_dive'], reaction: 'A navegação começou com um destino. O destino não foi localizado.' },
      { id: 'many_tabs', text: 'Abro tantas abas que preciso pesquisar como organizar minhas abas.', points: 5, surprise: 8, tags: ['deep_dive', 'pattern_hunter'], reaction: 'Você criou um problema para resolver outro problema que você mesmo criou. Anotado.' }
    ]
  },
  {
    id: 'curiosity', category: 'CURIOSIDADE E INVESTIGAÇÃO', categoryKey: 'curiosity', type: 'single', weight: 1.2, maxPoints: 5,
    title: 'Você encontra uma informação estranha. O que faz?',
    description: 'Uma informação estranha pode ser apenas estranha. Não é obrigatório transformar tudo numa investigação.',
    options: [
      { id: 'scroll', text: 'Continuo rolando. A internet está cheia de coisas estranhas.', points: 0, surprise: -2, tags: ['routine'], reaction: 'Capacidade de seguir em frente detectada. Quase invejável.' },
      { id: 'read', text: 'Leio um pouco mais para entender o contexto.', points: 1, surprise: 0, tags: ['curiosity'], reaction: 'Uma dose saudável de curiosidade. Sem necessidade de alarme.' },
      { id: 'sources', text: 'Procuro a fonte e comparo com outras informações.', points: 3, surprise: 4, tags: ['deep_dive', 'researcher'], reaction: 'Você verificou a fonte. A barra de confiança no mundo subiu ligeiramente.' },
      { id: 'theory', text: 'Vou atrás das conexões até montar uma explicação própria.', points: 5, surprise: 9, tags: ['deep_dive', 'researcher', 'systems'], reaction: 'Você não queria apenas uma resposta. Queria o mapa inteiro.' }
    ]
  },
  {
    id: 'interests', category: 'INTERESSES E PADRÕES', categoryKey: 'interests', type: 'single', weight: 1.05, maxPoints: 5,
    title: 'Qual tipo de assunto consegue prender sua atenção?',
    description: 'Escolha o que realmente desperta sua curiosidade, não o que parece mais impressionante.',
    options: [
      { id: 'everyday', text: 'Coisas práticas que facilitam o dia a dia.', points: 0, surprise: -1, tags: ['practical'], reaction: 'Utilidade prática. O auditor aprova a economia de energia.' },
      { id: 'stories', text: 'Histórias, personagens e universos imaginários.', points: 1, surprise: 1, tags: ['stories'], reaction: 'Imaginação presente. O relatório continua respirando normalmente.' },
      { id: 'systems', text: 'Como sistemas e mecanismos funcionam por trás da superfície.', points: 3, surprise: 4, tags: ['systems', 'researcher'], reaction: 'Você olha para uma caixa e quer saber como ela foi construída.' },
      { id: 'odd_connections', text: 'Conexões improváveis entre assuntos que parecem não ter nada a ver.', points: 5, surprise: 8, tags: ['pattern_hunter', 'systems'], reaction: 'Conexões improváveis. Finalmente, algo que exige mais de uma linha no relatório.' }
    ]
  },
  {
    id: 'creation', category: 'CRIATIVIDADE E EXECUÇÃO', categoryKey: 'creativity', type: 'single', weight: 1.2, maxPoints: 5,
    title: 'Uma ideia prende sua atenção. O que acontece depois?',
    description: 'Estamos observando a distância entre “seria legal” e “já abri os arquivos do projeto”.',
    options: [
      { id: 'save', text: 'Acho interessante e sigo com outras coisas.', points: 0, surprise: -2, tags: ['routine'], reaction: 'Uma ideia pode existir sem virar uma obrigação. Conceito revolucionário.' },
      { id: 'research', text: 'Pesquiso como poderia funcionar.', points: 2, surprise: 2, tags: ['researcher', 'deep_dive'], reaction: 'A ideia passou pela primeira inspeção: pesquisa.' },
      { id: 'prototype', text: 'Faço um pequeno experimento para ver se dá certo.', points: 4, surprise: 6, tags: ['builder', 'experiment'], reaction: 'Você prefere descobrir se funciona em vez de discutir isso por três semanas.' },
      { id: 'build', text: 'Começo a construir uma versão, mesmo sem ninguém ter pedido.', points: 5, surprise: 9, tags: ['builder', 'experiment'], reaction: 'Ninguém pediu. Você começou mesmo assim. O auditor endireita a postura.' }
    ]
  },
  {
    id: 'power', category: 'ESCOLHA HIPOTÉTICA', categoryKey: 'interests', type: 'multi', weight: 1.35, maxPoints: 9, maxSelect: 2,
    title: 'Se pudesse escolher um superpoder, qual seria?',
    description: 'Escolha até dois. Higuruma quer entender sua preferência, não emitir uma acusação.',
    options: [
      { id: 'flight', text: 'Voar', detail: 'Deslocamento sem trânsito. Benefícios logísticos claros.', points: 1, surprise: 0, tags: ['fantasy'], reaction: 'Voar. Prático, compreensível e pouco preocupante.' },
      { id: 'strength', text: 'Superforça', detail: 'Levantar coisas pesadas e impressionar móveis.', points: 0, surprise: -1, tags: ['fantasy'], reaction: 'Superforça. Uma escolha bastante direta.' },
      { id: 'animals', text: 'Conversar com animais', detail: 'Finalmente descobrir o que o cachorro está tentando dizer.', points: 2, surprise: 2, tags: ['empathy', 'fantasy'], reaction: 'Uma escolha curiosa. O auditor gostaria de ouvir a opinião dos gatos.' },
      { id: 'teleport', text: 'Teletransporte', detail: 'Ir embora de qualquer lugar sem precisar explicar a saída.', points: 3, surprise: 4, tags: ['mobility', 'fantasy'], reaction: 'Eficiência logística elevada. Nenhuma pergunta adicional neste momento.' },
      { id: 'telekinesis', text: 'Telecinese', detail: 'Controle de objetos à distância. A aplicação prática é evidente.', points: 2, surprise: 3, tags: ['control', 'fantasy'], reaction: 'Manipulação à distância. O auditor marca a opção como tecnicamente versátil.' },
      { id: 'mind_reading', text: 'Ler mentes', detail: 'Descobrir o que as pessoas estão pensando.', points: 4, surprise: 7, tags: ['information', 'fantasy'], reaction: 'O auditor fecha lentamente uma aba no tablet. “Privacidade é um conceito importante.”' },
      { id: 'invisibility', text: 'Invisibilidade', detail: 'Não ser visto quando você escolhe.', points: 4, surprise: 8, tags: ['stealth', 'fantasy'], reaction: 'Invisibilidade. O auditor mantém a expressão neutra. Com algum esforço.' },
      { id: 'time_stop', text: 'Parar o tempo', detail: 'O mundo pausa. Você continua consciente.', points: 5, surprise: 10, tags: ['time_control', 'fantasy'], reaction: 'Parar o tempo. O auditor interrompe a digitação por um instante.' }
    ]
  },
  {
    id: 'planning', category: 'HÁBITOS COTIDIANOS', categoryKey: 'habits', type: 'single', weight: 0.85, maxPoints: 5,
    title: 'Como você costuma lidar com planos?',
    description: 'Pense no seu comportamento habitual, não no plano ideal que você gostaria de seguir.',
    options: [
      { id: 'go_with_flow', text: 'Prefiro decidir conforme as coisas acontecem.', points: 1, surprise: 1, tags: ['improviser'], reaction: 'Improviso. Às vezes, a melhor ferramenta é não abrir mais uma planilha.' },
      { id: 'plan_basics', text: 'Planejo o básico e deixo espaço para mudar.', points: 2, surprise: 2, tags: ['planner', 'flexible'], reaction: 'Estrutura suficiente para sobreviver ao contato com a realidade.' },
      { id: 'detailed_plan', text: 'Gosto de organizar as etapas antes de começar.', points: 3, surprise: 4, tags: ['planner', 'systems'], reaction: 'Um plano. Com etapas. O auditor está tentando não demonstrar aprovação.' },
      { id: 'plan_then_improvise', text: 'Planejo tudo e depois improviso quando o plano encontra a vida real.', points: 5, surprise: 7, tags: ['planner', 'improviser'], reaction: 'Você constrói uma estrutura e depois testa a resistência dela contra o caos.' }
    ]
  },
  {
    id: 'problem', category: 'CURIOSIDADE E INVESTIGAÇÃO', categoryKey: 'curiosity', type: 'single', weight: 1.05, maxPoints: 5,
    title: 'Um projeto ou problema deixa de funcionar. Qual é seu primeiro impulso?',
    description: 'O primeiro impulso costuma dizer mais do que a solução final. Às vezes, porém, você só precisa de café.',
    options: [
      { id: 'pause', text: 'Faço uma pausa e volto depois.', points: 1, surprise: -1, tags: ['routine'], reaction: 'Uma pausa estratégica. O auditor registra: “evita discutir com o computador”.' },
      { id: 'known_solution', text: 'Procuro uma solução que já funcionou antes.', points: 2, surprise: 1, tags: ['practical'], reaction: 'Reutilizar uma solução conhecida. Eficiência raramente rende uma cena dramática.' },
      { id: 'debug', text: 'Tento descobrir exatamente onde começou a falhar.', points: 4, surprise: 6, tags: ['debugger', 'systems', 'deep_dive'], reaction: 'Você quer localizar a falha, não apenas empurrá-la para outro lugar.' },
      { id: 'rebuild', text: 'Crio um teste pequeno, comparo resultados e vou isolando as causas.', points: 5, surprise: 9, tags: ['debugger', 'experiment', 'researcher'], reaction: 'Teste controlado. Comparação. Isolamento de causas. O auditor acabou de se sentar direito.' }
    ]
  },
  {
    id: 'free_day', category: 'CRIATIVIDADE E EXECUÇÃO', categoryKey: 'creativity', type: 'single', weight: 0.95, maxPoints: 5,
    title: 'Você ganha um dia inteiro sem compromissos. Qual plano parece melhor?',
    description: 'Não existe resposta moralmente superior. O objetivo é descobrir o que você realmente acha interessante.',
    options: [
      { id: 'rest_day', text: 'Descansar sem transformar o descanso em mais uma tarefa.', points: 0, surprise: -2, tags: ['routine'], reaction: 'Descansar sem otimizar o descanso. Uma decisão razoável e ofensivamente sensata.' },
      { id: 'explore', text: 'Explorar algo novo e ver onde vou parar.', points: 2, surprise: 3, tags: ['improviser', 'curiosity'], reaction: 'Um destino incerto. O auditor finge não gostar da ideia.' },
      { id: 'make_something', text: 'Construir, desenhar, programar ou experimentar alguma coisa.', points: 4, surprise: 6, tags: ['builder', 'experiment'], reaction: 'Um dia livre e você ainda escolhe criar coisas. O relatório ganha uma anotação.' },
      { id: 'understand_system', text: 'Mergulhar num assunto até entender como ele funciona por dentro.', points: 5, surprise: 8, tags: ['researcher', 'deep_dive'], reaction: 'Você escolheu lazer em formato de investigação. O auditor reconhece o padrão.' }
    ]
  }
];


// 32 perguntas adicionais. Junto às 8 originais, o acervo contém 40 perguntas.
const EXTRA_QUESTIONS = [
  // Hábitos e rotina
  makeBankQuestion('commute_choice', 'habits', 'Você precisa chegar a um lugar conhecido. Como costuma escolher o caminho?', 'Pequenos hábitos também contam uma história, embora nem todos mereçam uma audiência.', [
    'Vou pelo caminho mais curto que já conheço.', 'Escolho conforme o trânsito, o clima ou o humor do dia.', 'Comparo rotas e tento evitar os pontos mais lentos.', 'Às vezes mudo o caminho só para descobrir algo diferente.'
  ]),
  makeBankQuestion('food_choice', 'habits', 'Na hora de escolher o que comer, o que pesa mais?', 'Não há resposta correta. O tribunal não julga o almoço.', [
    'Peço algo conhecido e não complico.', 'Vejo o que estou com vontade de comer.', 'Procuro uma opção que combine sabor, preço e praticidade.', 'Experimento algo que nunca pedi, só para saber como é.'
  ]),
  makeBankQuestion('waiting_time', 'habits', 'Você chega quinze minutos antes de um compromisso. O que faz?', 'O tempo extra foi concedido sem instruções de uso.', [
    'Espero tranquilamente até a hora.', 'Olho o celular e deixo o tempo passar.', 'Aproveito para adiantar uma tarefa pequena.', 'Exploro o lugar, observo os detalhes ou começo uma conversa.'
  ]),
  makeBankQuestion('remembering', 'habits', 'Você precisa se lembrar de algo importante mais tarde. Qual é seu método?', 'Memória humana: um recurso confiável até resolver não colaborar.', [
    'Tento guardar na cabeça.', 'Repito a informação para mim mesmo.', 'Anoto no celular ou coloco um lembrete.', 'Crio uma associação ou um sistema para não esquecer.'
  ]),
  makeBankQuestion('workspace', 'habits', 'Como costuma ser o espaço onde você passa mais tempo?', 'A organização do ambiente não será confundida com o valor moral de ninguém.', [
    'Funcional, com as coisas de que preciso.', 'Um pouco bagunçado, mas sei onde está quase tudo.', 'Organizado por tipo ou frequência de uso.', 'Muda conforme o projeto ou a ideia em que estou trabalhando.'
  ]),
  makeBankQuestion('weekend_style', 'habits', 'Como você prefere organizar um fim de semana livre?', 'O descanso não precisa apresentar um plano de negócios.', [
    'Decido na hora e sigo o ritmo do dia.', 'Tenho uma ou duas coisas em mente.', 'Planejo atividades e horários aproximados.', 'Monto um plano e deixo espaço para oportunidades inesperadas.'
  ]),
  makeBankQuestion('purchase_research', 'habits', 'Você quer comprar algo que nunca usou. Como decide?', 'Uma escolha cotidiana, sem necessidade de convocar o júri.', [
    'Escolho uma opção conhecida ou barata.', 'Leio algumas avaliações rápidas.', 'Comparo recursos, preço e opiniões diferentes.', 'Investigo alternativas até entender o que realmente faz diferença.'
  ]),
  makeBankQuestion('morning_person', 'habits', 'Qual é sua relação com as primeiras horas do dia?', 'O entrevistador parece considerar o conceito de acordar cedo uma questão administrativa.', [
    'Preciso de silêncio e tempo para despertar.', 'Funciono depois de um café ou de uma rotina simples.', 'Gosto de começar logo e resolver alguma coisa.', 'Minha energia depende tanto do dia que qualquer regra seria ficção.'
  ]),

  // Curiosidade e investigação
  makeBankQuestion('odd_fact', 'curiosity', 'Alguém conta um fato curioso que parece improvável. Sua reação?', 'O fato pode ser banal. A forma como você lida com ele é o que interessa.', [
    'Aceito que é curioso e sigo a conversa.', 'Pergunto onde a pessoa ouviu isso.', 'Procuro uma fonte confiável depois.', 'Vou atrás das origens e tento descobrir por que isso acontece.'
  ]),
  makeBankQuestion('mystery', 'curiosity', 'Você encontra um mistério sem importância prática. O que tende a fazer?', 'A ausência de utilidade imediata não encerra necessariamente a investigação.', [
    'Deixo para lá; há coisas que podem continuar misteriosas.', 'Tento adivinhar a explicação.', 'Procuro algumas pistas para ver se há uma resposta.', 'Continuo até encontrar uma explicação que faça sentido.'
  ]),
  makeBankQuestion('manuals', 'curiosity', 'Você compra um aparelho novo. Quando lê o manual?', 'O silêncio do entrevistador sugere que ele já sabe que existem dois tipos de pessoa.', [
    'Só quando alguma coisa dá errado.', 'Dou uma olhada nas instruções básicas.', 'Leio as partes relevantes antes de usar.', 'Leio por curiosidade e testo funções que talvez nunca precise.'
  ]),
  makeBankQuestion('news_check', 'curiosity', 'Uma notícia surpreendente aparece no seu feed. Como você reage?', 'A velocidade de uma notícia não é a mesma coisa que a qualidade da evidência.', [
    'Continuo rolando; não preciso acompanhar tudo.', 'Leio a notícia inteira antes de formar uma opinião.', 'Procuro outra fonte para confirmar os detalhes.', 'Tento localizar a fonte original e separar fato de interpretação.'
  ]),
  makeBankQuestion('disagreement', 'curiosity', 'Duas pessoas inteligentes defendem explicações opostas. O que desperta seu interesse?', 'Divergência não significa automaticamente que alguém está mentindo.', [
    'Prefiro não entrar na discussão.', 'Escuto a explicação que parece mais clara.', 'Comparo os argumentos e vejo onde discordam.', 'Procuro quais evidências fariam cada lado mudar de ideia.'
  ]),
  makeBankQuestion('history_question', 'curiosity', 'Você descobre que um costume antigo era muito diferente do atual. O que faz?', 'O passado tem a inconveniente tendência de ser mais estranho do que parece.', [
    'Acho curioso e guardo a informação.', 'Leio um resumo para entender o contexto.', 'Pesquiso como o costume mudou ao longo do tempo.', 'Investigo quais fatores sociais ou tecnológicos provocaram a mudança.'
  ]),
  makeBankQuestion('object_origin', 'curiosity', 'Você vê um objeto comum cujo funcionamento não entende. Qual é sua reação?', 'O objeto não se ofenderá caso você não o desmonte.', [
    'Uso como está, desde que funcione.', 'Procuro uma explicação simples.', 'Vejo um vídeo ou diagrama que mostre como funciona.', 'Tento entender as partes e como elas interagem.'
  ]),
  makeBankQuestion('learn_skill', 'curiosity', 'Você quer aprender uma habilidade nova. Como costuma começar?', 'O entrevistador observa o método, não exige um talento extraordinário.', [
    'Começo quando surge uma necessidade real.', 'Procuro uma introdução fácil e vejo se gosto.', 'Sigo um curso ou um conjunto de exercícios.', 'Monto pequenos testes para descobrir o que ainda não sei fazer.'
  ]),

  // Preferências e interesses
  makeBankQuestion('media_choice', 'interests', 'Quando escolhe algo para assistir, o que mais chama sua atenção?', 'O gosto pessoal não precisa ser defendido perante a corte.', [
    'Algo leve, familiar ou fácil de acompanhar.', 'Uma história com personagens interessantes.', 'Uma trama com detalhes que recompensam a atenção.', 'Uma obra que me faça reinterpretar o que vi depois.'
  ]),
  makeBankQuestion('music_focus', 'interests', 'O que costuma fazer você gostar de uma música?', 'Não haverá teste de afinação nem interrogatório sobre sua playlist.', [
    'O ritmo combina com meu humor.', 'A melodia ou a voz me agrada.', 'Presto atenção na letra, na composição ou nos instrumentos.', 'Gosto de descobrir camadas e detalhes a cada audição.'
  ]),
  makeBankQuestion('place_interest', 'interests', 'Você chega a uma cidade que nunca visitou. O que gostaria de conhecer primeiro?', 'Não existe roteiro oficial para ser uma pessoa interessante.', [
    'Um lugar confortável para comer ou descansar.', 'Os pontos mais conhecidos da cidade.', 'Bairros, arquitetura e lugares frequentados por moradores.', 'Locais incomuns e histórias que não aparecem em todo guia.'
  ]),
  makeBankQuestion('travel_style', 'interests', 'Qual viagem parece mais atraente para você?', 'O entrevistador não está vendendo pacotes turísticos.', [
    'Descansar em um lugar confortável.', 'Conhecer os principais pontos e experimentar a comida local.', 'Combinar atrações planejadas com exploração livre.', 'Aprender sobre o lugar por meio de suas rotinas, histórias e pessoas.'
  ]),
  makeBankQuestion('learning_topic', 'interests', 'Você pode aprender algo apenas por prazer. Qual assunto escolheria?', 'A resposta não precisa ser útil para o currículo.', [
    'Algo prático que simplifique minha vida.', 'Uma língua, uma arte ou uma história.', 'Um tema que me ajude a entender como o mundo funciona.', 'Um assunto incomum que conecte várias áreas diferentes.'
  ]),
  makeBankQuestion('collecting', 'interests', 'Você costuma guardar coisas pequenas, como ingressos, fotos ou anotações?', 'O acúmulo de objetos não será usado como evidência de caráter.', [
    'Quase nunca; prefiro manter poucas coisas.', 'Guardo algumas lembranças importantes.', 'Organizo fotos, notas ou coleções por tema.', 'Acabo criando um arquivo pessoal de coisas que despertam minha curiosidade.'
  ]),
  makeBankQuestion('weather_interest', 'interests', 'Quando o tempo muda de repente, você costuma reparar?', 'Uma pergunta sobre o clima. Por alguns segundos, ninguém será acusado de nada.', [
    'Só reparo se isso muda meus planos.', 'Gosto de comentar quando o tempo está diferente.', 'Fico curioso sobre a causa da mudança.', 'Tento entender os padrões e como o clima pode evoluir.'
  ]),
  makeBankQuestion('animal_interest', 'interests', 'O que mais chama sua atenção ao observar um animal?', 'O entrevistador faz uma anotação discreta, sem revelar se gosta de gatos.', [
    'A aparência ou o jeito engraçado.', 'O comportamento e a personalidade.', 'Como se comunica e se adapta ao ambiente.', 'O que seus hábitos revelam sobre seu instinto e sua evolução.'
  ]),

  // Criatividade e escolhas
  makeBankQuestion('gift_idea', 'creativity', 'Você precisa escolher um presente para alguém de quem gosta. Como decide?', 'Não existe pontuação por preço. Felizmente.', [
    'Escolho algo útil e confiável.', 'Penso nos gostos da pessoa e seleciono algo relacionado.', 'Procuro algo personalizado ou ligado a uma lembrança.', 'Crio ou monto algo que só faria sentido para aquela pessoa.'
  ]),
  makeBankQuestion('blank_page', 'creativity', 'Você recebe uma folha em branco e pode fazer qualquer coisa nela. O que acontece?', 'A folha continua vazia até alguém decidir o contrário.', [
    'Uso para anotar o que preciso fazer.', 'Faço um desenho simples ou escrevo alguma coisa.', 'Experimento um estilo, uma ideia ou uma composição.', 'Transformo a folha em parte de um projeto maior.'
  ]),
  makeBankQuestion('constraint', 'creativity', 'Você precisa resolver um problema com recursos limitados. Sua primeira reação?', 'Limitações podem irritar ou virar parte do desafio.', [
    'Procuro uma solução simples com o que já tenho.', 'Adapto uma solução conhecida.', 'Combino ferramentas de maneiras diferentes.', 'Reformulo o problema para encontrar uma possibilidade que ninguém considerou.'
  ]),
  makeBankQuestion('story_prompt', 'creativity', 'Alguém pede que você invente uma história em um minuto. Como começa?', 'A improvisação não será submetida a revisão editorial.', [
    'Uso uma situação familiar e sigo em frente.', 'Penso em um personagem e no que ele quer.', 'Começo com um conflito ou uma reviravolta.', 'Crio uma regra estranha para o mundo e vejo quais consequências aparecem.'
  ]),
  makeBankQuestion('recipe_change', 'creativity', 'Você segue uma receita e percebe que falta um ingrediente. O que faz?', 'O resultado culinário não será apresentado como prova criminal.', [
    'Escolho outra receita ou deixo para depois.', 'Substituo por algo parecido.', 'Adapto as quantidades para equilibrar o resultado.', 'Uso a falta como desculpa para testar uma versão nova.'
  ]),
  makeBankQuestion('personal_project', 'creativity', 'Você tem uma ideia para um projeto pessoal. Qual é seu primeiro passo?', 'Não é preciso transformar cada interesse em uma startup.', [
    'Guardo a ideia e volto a ela se continuar interessante.', 'Anoto o conceito para não esquecer.', 'Faço um esboço ou uma versão bem pequena.', 'Começo um protótipo e aprendo enquanto construo.'
  ]),
  makeBankQuestion('team_idea', 'creativity', 'Em um trabalho em grupo, ninguém sabe como começar. O que você tende a fazer?', 'Colaboração não é uma competição para ver quem manda mais.', [
    'Espero que o grupo combine um caminho.', 'Sugiro algumas opções para discussão.', 'Organizo as ideias e proponho um primeiro passo.', 'Crio uma versão inicial para que todos possam reagir a algo concreto.'
  ]),
  makeBankQuestion('room_change', 'creativity', 'Você poderia mudar uma coisa no seu espaço para deixá-lo melhor. O que faria?', 'A melhoria não precisa justificar uma reforma completa.', [
    'Resolveria primeiro algo que incomoda no dia a dia.', 'Mudaria a disposição de alguns objetos.', 'Criaria um sistema ou espaço dedicado a uma atividade.', 'Repensaria o ambiente para ele funcionar de um jeito completamente diferente.'
  ])
];

const POWER_QUESTION = CORE_QUESTIONS.find((question) => question.id === 'power');
const QUESTION_BANK = [...CORE_QUESTIONS.filter((question) => question.id !== 'power'), ...EXTRA_QUESTIONS, POWER_QUESTION];

const FOLLOW_UPS = [
  {
    id: 'follow_privacy', isFollowup: true, category: 'PERGUNTAS COMPLEMENTARES', categoryKey: null, type: 'single', weight: 0, maxPoints: 0,
    title: 'Quando ninguém está observando, o que muda no seu comportamento?',
    description: 'O auditor pergunta isso com uma neutralidade que parece ter sido ensaiada no espelho.',
    options: [
      { id: 'same_person', text: 'Nada essencial. Continuo respeitando os mesmos limites.', detail: 'Resposta direta.', suspicion: -3, surprise: 0, reaction: '“Certo.” O auditor registra a resposta e parece um pouco decepcionado com a própria teoria.' },
      { id: 'quiet_explore', text: 'Aproveito a tranquilidade para explorar coisas sem atrapalhar ninguém.', suspicion: 0, surprise: 1, reaction: '“Explorar. Certo. Uma palavra com muitas aplicações.”' },
      { id: 'different_actions', text: 'Depende. Talvez eu fizesse algo que normalmente não faria com todo mundo olhando.', suspicion: 3, surprise: 4, reaction: 'O auditor para de escrever. “Poderia especificar? Não, deixe. Continue.”' },
      { id: 'why_ask', text: 'Por que você está perguntando isso especificamente?', suspicion: 2, surprise: 4, reaction: '“Eu faço as perguntas por aqui.” O auditor acrescenta uma nota sem mostrar a tela.' }
    ]
  },
  {
    id: 'follow_limits', isFollowup: true, category: 'PERGUNTAS COMPLEMENTARES', categoryKey: null, type: 'single', weight: 0, maxPoints: 0,
    title: 'Na sua opinião, o fato de ninguém perceber uma ação muda se ela é aceitável?',
    description: 'A pausa antes da pergunta é mais longa do que seria estritamente necessário.',
    options: [
      { id: 'boundaries', text: 'Não. O respeito aos limites não depende de ser descoberto.', suspicion: -3, surprise: 0, reaction: '“Uma resposta clara.” O auditor parece relutantemente satisfeito.' },
      { id: 'depends_harm', text: 'Depende da ação e de quem pode ser afetado.', suspicion: 0, surprise: 1, reaction: '“Uma distinção razoável.” Ele não parece convencido nem desconfiado.' },
      { id: 'no_consequences', text: 'Se ninguém percebe, talvez não existam consequências práticas.', suspicion: 4, surprise: 6, reaction: 'O auditor bloqueia a tela do tablet. “Essa frase será revisada.”' },
      { id: 'legal_counsel', text: 'Acho que preciso de um advogado para continuar este formulário.', suspicion: 2, surprise: 5, reaction: '“Este formulário não oferece representação legal.” O auditor faz uma anotação muito longa.' }
    ]
  },
  {
    id: 'follow_time', isFollowup: true, category: 'PERGUNTAS COMPLEMENTARES', categoryKey: null, type: 'single', weight: 0, maxPoints: 0,
    title: 'Se pudesse parar o tempo por dez minutos, o que faria primeiro?',
    description: 'O auditor diz que é apenas uma pergunta hipotética. Não parece especialmente relaxado.',
    options: [
      { id: 'me_time', text: 'Usaria o tempo extra para descansar, pensar ou fazer algo só meu.', suspicion: -2, surprise: 0, reaction: '“Tempo pessoal. Certo.” A postura dele relaxa por aproximadamente dois milímetros.' },
      { id: 'practical_fix', text: 'Resolveria um problema prático sem colocar ninguém em risco.', suspicion: -1, surprise: 1, reaction: '“Uma aplicação prática e sem interferência. Anotado.”' },
      { id: 'unseen_test', text: 'Testaria o que consigo fazer quando ninguém consegue me notar.', suspicion: 3, surprise: 5, reaction: '“Essa não era a parte que eu esperava que você enfatizasse.”' },
      { id: 'no_comment', text: 'Prefiro não responder a essa pergunta sem ler os termos e condições.', suspicion: 2, surprise: 4, reaction: 'O auditor olha para o usuário. “Pelo menos alguém lê os termos.” Ele não parece tranquilizado.' }
    ]
  }
];

// Perguntas dinâmicas adicionais ativadas por combos especiais que mudam o rumo da interação
const FOLLOW_SYSTEM_QUESTION = {
  id: 'follow_system_hack', isFollowup: true, category: 'AUDITORIA DE SISTEMA', categoryKey: null, type: 'single', weight: 1.1, maxPoints: 5,
  title: 'Se você descobrisse uma falha oculta neste teste, qual seria sua reação?',
  description: 'Higuruma apoia a caneta no papel e olha com a atenção de quem já desconfia da resposta.',
  options: [
    { id: 'report_bug', text: 'Avisaria o desenvolvedor e seguiria a vida.', points: 1, surprise: 1, tags: ['routine', 'practical'], reaction: '“Ordem e respeito às regras. O tribunal aprova essa atitude.”' },
    { id: 'test_limits', text: 'Testaria os limites para ver até onde consigo quebrar a lógica do sistema.', points: 5, surprise: 8, tags: ['debugger', 'systems', 'deep_dive'], reaction: '“Como imaginei. Uma anomalia lógica que não resiste a testar as fronteiras.”' },
    { id: 'cheat_score', text: 'Tentaria forçar minha pontuação para 100/100.', points: 4, surprise: 7, tags: ['improviser', 'systems'], reaction: '“Uma tentativa de adulteração de relatório. O auditor anota com rigor.”' },
    { id: 'reverse_interview', text: 'Criaria meu próprio sistema para entrevistar o entrevistador.', points: 5, surprise: 9, tags: ['pattern_hunter', 'builder', 'systems'], reaction: '“Inverter os papéis do tribunal? Uma ousadia digna de nota no dossiê.”' }
  ]
};

const FOLLOW_CHAOS_QUESTION = {
  id: 'follow_creative_chaos', isFollowup: true, category: 'SOBRECARGA CRIATIVA', categoryKey: null, type: 'single', weight: 1.1, maxPoints: 5,
  title: 'Quando uma ideia ou projeto seu finalmente dá certo, qual é seu próximo reflexo?',
  description: 'Higuruma apoia o queixo na mão, tentando antecipar o próximo desastre criativo.',
  options: [
    { id: 'close_tabs', text: 'Respiro aliviado, fecho todas as 47 abas e tiro um descanso merecido.', points: 1, surprise: 1, tags: ['routine'], reaction: '“Uma pausa estratégica. Quase não acreditei que você optaria pela sensatez.”' },
    { id: 'complex_v2', text: 'Imediatamente começo a planejar uma versão 2.0 com o dobro de complexidade.', points: 5, surprise: 8, tags: ['builder', 'experiment'], reaction: '“Você não quer uma solução, quer o ciclo perpétuo da invenção. Fascinante e exaustivo.”' },
    { id: 'switch_domain', text: 'Mudo de assunto e vou explorar uma área completamente não relacionada.', points: 4, surprise: 6, tags: ['improviser', 'curiosity'], reaction: '“Dispersão fértil. Seu cérebro claramente recusa a monotonia.”' },
    { id: 'explain_unasked', text: 'Tento explicar meu processo genial para alguém que não pediu para ouvir.', points: 5, surprise: 8, tags: ['pattern_hunter', 'builder'], reaction: '“O entusiasmo do criador é uma arma de perturbação da ordem pública. Anotado.”' }
  ]
};

const FOLLOW_NORMAL_QUESTION = {
  id: 'follow_too_normal', isFollowup: true, category: 'AVERIGUAÇÃO DE NORMALIDADE', categoryKey: null, type: 'single', weight: 0.9, maxPoints: 5,
  title: 'Seja sincero com o tribunal: você é realmente tão pacato ou está disfarçando?',
  description: 'Higuruma observa por cima dos óculos: pessoas normais demais são uma raridade estatística.',
  options: [
    { id: 'genuine_peace', text: 'Eu realmente só valorizo minha paz, minha rotina e zero complicação.', points: 1, surprise: 0, tags: ['routine'], reaction: '“Uma raridade genuína. Um indivíduo que encontra satisfação na estabilidade.”' },
    { id: 'secret_weirdness', text: 'Minhas excentricidades só aparecem depois da meia-noite, longe de formulários.', points: 3, surprise: 4, tags: ['flexible', 'stories'], reaction: '“Aí está a confissão. Ninguém é imune a pequenos desvios cotidianos.”' },
    { id: 'camouflage', text: 'A normalidade absoluta é a melhor camuflagem para passar despercebido.', points: 4, surprise: 6, tags: ['pattern_hunter', 'practical'], reaction: '“Uma estratégia inteligente. Usar o padrão para não atrair investigações.”' },
    { id: 'fifth_amendment', text: 'Prefiro invocar meu direito de não produzir provas contra minha rotina.', points: 3, surprise: 5, tags: ['improviser'], reaction: '“O uso do direito ao silêncio. Um clássico perante a corte.”' }
  ]
};

const COMBO_RULES = [
  {
    id: 'power_protocol', title: 'O TEMPO PAROU. O AUDITOR TAMBÉM.',
    text: 'A combinação de invisibilidade e controle do tempo ativou um protocolo narrativo complementar.',
    isPowerCombo: true,
    bannerText: '⚡ PROTOCOLO NARRATIVO: O PARADOXO ÉTICO — INVESTIGAÇÃO ABERTA'
  },
  {
    id: 'system_breaker', title: 'Auditoria de Sistema: O Metagamer',
    text: 'Você demonstrou obsessão por desvendar mecanismos ocultos e tentar depurar o próprio teste.',
    isBranchCombo: true,
    branchType: 'system',
    bannerText: '⚡ COMBO DETECTADO: AUDITORIA DE SISTEMA (O METAGAMER) — ROTA ALTERADA'
  },
  {
    id: 'chaos_architect', title: 'Arquiteto do Caos Estruturado',
    text: 'Você combinou planejamento meticuloso com a irresistível vontade de improvisar e criar novos desafios.',
    isBranchCombo: true,
    branchType: 'chaos',
    bannerText: '⚡ COMBO DETECTADO: ARQUITETO DO CAOS ESTRUTURADO — ROTA ALTERADA'
  },
  {
    id: 'ultra_normal', title: 'O Cidadão Absolutamente Comum',
    text: 'Suas respostas foram tão impecavelmente pragmáticas que o próprio tribunal estranhou tanta normalidade.',
    isBranchCombo: true,
    branchType: 'normal',
    bannerText: '⚡ COMBO DETECTADO: O CIDADÃO ABSOLUTAMENTE COMUM — ROTA ALTERADA'
  },
  {
    id: 'investigator_builder', title: 'Curiosidade aplicada',
    text: 'Você combinou investigação persistente com a tendência de transformar ideias em experimentos.',
    tags: ['deep_dive', 'builder']
  },
  {
    id: 'systems_builder', title: 'Teoria que virou projeto',
    text: 'Seu interesse por sistemas aparece junto de uma preferência por construir e testar coisas.',
    tags: ['systems', 'builder']
  },
  {
    id: 'planner_improviser', title: 'Planejamento em conflito com o caos',
    text: 'Suas escolhas sugerem uma combinação lúdica de organização e improvisação.',
    tags: ['planner', 'improviser']
  },
  {
    id: 'pattern_diver', title: 'Caçador de padrões',
    text: 'Você demonstrou interesse por conexões e também disposição para investigar além da primeira resposta.',
    tags: ['pattern_hunter', 'deep_dive']
  }
];

const DIMENSIONS = [
  { key: 'habits', label: 'HÁBITOS' },
  { key: 'curiosity', label: 'CURIOSIDADE' },
  { key: 'interests', label: 'INTERESSES' },
  { key: 'creativity', label: 'CRIAÇÃO' }
];
const AUDITOR_STATES = ['state-bored', 'state-neutral', 'state-curious', 'state-fascinated', 'state-suspicious', 'state-chaos'];

const $ = (id) => document.getElementById(id);
const screens = { landing: $('landingScreen'), quiz: $('quizScreen'), result: $('resultScreen') };
let answers = Object.create(null);
let historyStack = []; // Pilha (LIFO): cada avanço empilha; voltar remove a resposta mais recente.
let stepIndex = 0;
let pendingSelection = null;
let lastDialogue = '“Vamos começar. Espero que não seja necessário um segundo depoimento.”';
let toastTimer = null;
let lastResult = null;
let sessionQuestions = [];
let sessionOptionOrder = new Map();
let recentDialogueKeys = [];

function hasPowerCombo(value) {
  return Array.isArray(value) && value.includes('invisibility') && value.includes('time_stop');
}

function hasSystemCombo(currentAnswers) {
  const targetTags = ['systems', 'deep_dive', 'researcher', 'debugger'];
  let count = 0;
  for (const q of sessionQuestions) {
    const ans = currentAnswers[q.id];
    if (!ans) continue;
    const ids = q.type === 'multi' ? ans : [ans];
    for (const id of ids) {
      const opt = getOption(q, id);
      if (opt && Array.isArray(opt.tags) && opt.tags.some((t) => targetTags.includes(t))) {
        count += 1;
        break;
      }
    }
  }
  return count >= 3;
}

function hasChaosCombo(currentAnswers) {
  const targetTags = ['builder', 'experiment', 'improviser'];
  let count = 0;
  for (const q of sessionQuestions) {
    const ans = currentAnswers[q.id];
    if (!ans) continue;
    const ids = q.type === 'multi' ? ans : [ans];
    for (const id of ids) {
      const opt = getOption(q, id);
      if (opt && Array.isArray(opt.tags) && opt.tags.some((t) => targetTags.includes(t))) {
        count += 1;
        break;
      }
    }
  }
  return count >= 3;
}

function hasNormalCombo(currentAnswers) {
  const targetTags = ['routine', 'practical'];
  let count = 0;
  for (const q of sessionQuestions) {
    const ans = currentAnswers[q.id];
    if (!ans) continue;
    const ids = q.type === 'multi' ? ans : [ans];
    for (const id of ids) {
      const opt = getOption(q, id);
      if (opt && Array.isArray(opt.tags) && opt.tags.some((t) => targetTags.includes(t))) {
        count += 1;
        break;
      }
    }
  }
  return count >= 3;
}

function getActiveBranchCombo() {
  if (hasPowerCombo(answers.power)) return COMBO_RULES.find((c) => c.id === 'power_protocol');
  if (hasSystemCombo(answers)) return COMBO_RULES.find((c) => c.id === 'system_breaker');
  if (hasChaosCombo(answers)) return COMBO_RULES.find((c) => c.id === 'chaos_architect');
  if (hasNormalCombo(answers)) return COMBO_RULES.find((c) => c.id === 'ultra_normal');
  return null;
}

function shuffle(items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
function pickQuestions(categoryKey, count) {
  return shuffle(QUESTION_BANK.filter((question) => question.categoryKey === categoryKey && question.id !== 'power')).slice(0, count);
}
function selectSessionQuestions() {
  // Quotas por categoria mantendo variedade: 2 hábitos, 2 curiosidade, 1 interesses, 2 criatividade + superpoderes
  const poolCommon = [
    ...pickQuestions('habits', 2),
    ...pickQuestions('curiosity', 2),
    ...pickQuestions('interests', 1),
    ...pickQuestions('creativity', 2)
  ];
  const shuffledCommon = shuffle(poolCommon);
  // Posicionamos a pergunta de superpoderes estrategicamente entre a 5ª e 6ª posição para melhor ritmo narrativo
  const powerPos = Math.min(5, shuffledCommon.length);
  shuffledCommon.splice(powerPos, 0, POWER_QUESTION);
  sessionQuestions = shuffledCommon;
  const allPossibleQuestions = [
    ...sessionQuestions,
    ...FOLLOW_UPS,
    FOLLOW_SYSTEM_QUESTION,
    FOLLOW_CHAOS_QUESTION,
    FOLLOW_NORMAL_QUESTION
  ];
  sessionOptionOrder = new Map(allPossibleQuestions.map((question) => [question.id, shuffle(question.options)]));
}
function optionsForQuestion(question) {
  return sessionOptionOrder.get(question.id) || question.options;
}
function getFlow() {
  const core = [...sessionQuestions];
  const activeCombo = getActiveBranchCombo();
  if (!activeCombo) return core;

  if (activeCombo.id === 'power_protocol') {
    const powerIndex = core.findIndex((question) => question.id === 'power');
    core.splice(powerIndex + 1, 0, ...FOLLOW_UPS);
    return core;
  }
  if (activeCombo.id === 'system_breaker') {
    return [...core, FOLLOW_SYSTEM_QUESTION];
  }
  if (activeCombo.id === 'chaos_architect') {
    return [...core, FOLLOW_CHAOS_QUESTION];
  }
  if (activeCombo.id === 'ultra_normal') {
    return [...core, FOLLOW_NORMAL_QUESTION];
  }
  return core;
}
function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.add('hidden'));
  screens[name].classList.remove('hidden');
  if (name === 'landing') $('topStatus').textContent = 'SESSÃO DISPONÍVEL';
  if (name === 'quiz') $('topStatus').textContent = 'SESSÃO EM ANDAMENTO';
  if (name === 'result') $('topStatus').textContent = $('secretResult').classList.contains('hidden') ? 'RELATÓRIO CONCLUÍDO' : 'RELATÓRIO RETIDO';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function startTest() {
  answers = Object.create(null);
  historyStack = [];
  stepIndex = 0;
  pendingSelection = null;
  lastDialogue = '“Vamos começar. Espero que não seja necessário um segundo depoimento.”';
  lastResult = null;
  selectSessionQuestions();
  recentDialogueKeys = [];
  $('normalResult').classList.remove('hidden');
  $('secretResult').classList.add('hidden');
  $('shareFeedback').textContent = '';
  $('caseId').textContent = `RH-404-${String(Math.floor(Math.random() * 90) + 10)}`;
  showScreen('quiz');
  renderQuestion();
}
function getOption(question, id) {
  return question.options.find((option) => option.id === id);
}
function selectedTags() {
  const found = [];
  for (const q of sessionQuestions) {
    const answer = answers[q.id];
    if (!answer) continue;
    const ids = q.type === 'multi' ? answer : [answer];
    for (const id of ids) {
      const option = getOption(q, id);
      if (option && Array.isArray(option.tags)) {
        option.tags.forEach((tag) => found.push({ tag, questionId: q.id }));
      }
    }
  }
  return found;
}
function findCombos() {
  const tags = selectedTags();
  const matches = [];
  const activeBranch = getActiveBranchCombo();
  if (activeBranch && !matches.some((m) => m.id === activeBranch.id)) {
    matches.push(activeBranch);
  }
  for (const rule of COMBO_RULES) {
    if (rule.isPowerCombo || rule.isBranchCombo) continue;
    if (!rule.tags || rule.tags.length < 2) continue;
    const firstIds = new Set(tags.filter((item) => item.tag === rule.tags[0]).map((item) => item.questionId));
    const secondIds = new Set(tags.filter((item) => item.tag === rule.tags[1]).map((item) => item.questionId));
    let matched = false;
    for (const a of firstIds) {
      for (const b of secondIds) if (a !== b) matched = true;
    }
    if (matched && !matches.some((m) => m.id === rule.id)) matches.push(rule);
  }
  return matches;
}
function getWeightedScore() {
  let earned = 0;
  let max = 0;
  for (const q of getFlow()) {
    if (q.maxPoints === 0 || q.weight === 0) continue;
    max += q.maxPoints * q.weight;
    const answer = answers[q.id];
    if (!answer) continue;
    if (q.type === 'multi') {
      earned += answer.reduce((sum, id) => sum + (getOption(q, id)?.points || 0), 0) * q.weight;
    } else {
      earned += (getOption(q, answer)?.points || 0) * q.weight;
    }
  }
  return max ? Math.max(0, Math.min(1, earned / max)) : 0;
}
function computeScore() {
  const comboMatches = findCombos();
  const base = getWeightedScore();
  // 85% do índice vem das respostas ponderadas. Até 15% vem de no máximo três combinações reconhecidas.
  const comboPortion = Math.min(comboMatches.length, 3) / 3;
  const score = Math.max(0, Math.min(100, Math.round(85 * base + 15 * comboPortion)));
  const dimensions = {};
  for (const dimension of DIMENSIONS) {
    let earned = 0;
    let maximum = 0;
    for (const q of sessionQuestions.filter((question) => question.categoryKey === dimension.key)) {
      maximum += q.maxPoints * q.weight;
      const answer = answers[q.id];
      if (!answer) continue;
      if (q.type === 'multi') earned += answer.reduce((sum, id) => sum + (getOption(q, id)?.points || 0), 0) * q.weight;
      else earned += (getOption(q, answer)?.points || 0) * q.weight;
    }
    dimensions[dimension.key] = maximum ? Math.round(100 * Math.min(1, earned / maximum)) : 0;
  }
  return { score, dimensions, comboMatches };
}
function computeSuspicion() {
  if (!hasPowerCombo(answers.power)) return 0;
  let total = 1; // A escolha do par apenas inicia a hipótese; não decide o final.
  for (const q of FOLLOW_UPS) {
    const answer = answers[q.id];
    if (!answer) continue;
    total += getOption(q, answer)?.suspicion || 0;
  }
  return total;
}
function getAttention() {
  let attention = 12;
  const flow = getFlow();
  for (const q of flow) {
    const answer = answers[q.id];
    if (!answer) continue;
    const ids = q.type === 'multi' ? answer : [answer];
    for (const id of ids) attention += getOption(q, id)?.surprise || 0;
  }
  const suspicion = computeSuspicion();
  if (hasPowerCombo(answers.power)) attention += 10 + Math.max(0, suspicion) * 2;
  return Math.max(0, Math.min(100, attention));
}
function getAuditorState() {
  const flow = getFlow();
  const current = flow[stepIndex];
  const attention = getAttention();
  if (hasPowerCombo(answers.power) && (current?.isFollowup || computeSuspicion() >= 6)) {
    if (computeSuspicion() >= 8) return 'state-chaos';
    return 'state-suspicious';
  }
  if (attention <= 14) return 'state-bored';
  if (attention < 35) return 'state-neutral';
  if (attention < 65) return 'state-curious';
  return 'state-fascinated';
}
function auditorCueFor(state, routeActive, suspicion = 0) {
  if (routeActive && suspicion >= 8) return 'Ele parou de fingir que está confortável. Até a antena ficou imóvel.';
  if (routeActive && suspicion >= 4) return 'A mão que segurava a caneta ficou suspensa. Ele está ouvindo com atenção demais.';
  if (routeActive) return 'Ele voltou a olhar para você em vez de olhar para o formulário.';
  const cues = {
    'state-bored': 'Ele inclina ligeiramente a cabeça. A expressão cansada não chega a mudar.',
    'state-neutral': 'Ele ajeita a gravata e continua anotando, sem pressa.',
    'state-curious': 'Uma sobrancelha se ergue. Ele relê a resposta antes de continuar.',
    'state-fascinated': 'Ele ergue o olhar por completo. Pela primeira vez, a caneta fica esquecida.',
    'state-suspicious': 'O humor muda. Ele se inclina para a frente e presta atenção às palavras exatas.',
    'state-chaos': 'Ele cobre parte do rosto com a mão, como quem precisa de alguns segundos antes de continuar.'
  };
  return cues[state] || cues['state-neutral'];
}
function auditorCueTagFor(state, routeActive) {
  if (routeActive) return 'PAUSA INCOMUM';
  if (state === 'state-bored') return 'LINGUAGEM CORPORAL';
  if (state === 'state-curious' || state === 'state-fascinated') return 'ATENÇÃO REDIRECIONADA';
  if (state === 'state-suspicious' || state === 'state-chaos') return 'COMPORTAMENTO ATÍPICO';
  return 'SINAL NÃO VERBAL';
}
function applyAuditorState() {
  const state = getAuditorState();
  const attention = getAttention();
  const routeActive = hasPowerCombo(answers.power);
  const suspicion = computeSuspicion();
  ['heroAuditor', 'quizAuditor', 'resultAuditor', 'secretAuditor'].forEach((id) => {
    const element = $(id);
    if (!element) return;
    element.classList.remove(...AUDITOR_STATES);
    element.classList.add(state);
  });
  const moodLabels = { 'state-bored': 'ENTEDIADO', 'state-neutral': 'NEUTRO', 'state-curious': 'INTRIGADO', 'state-fascinated': 'IMPRESSÃO FORTE', 'state-suspicious': 'ATENTO AO CASO', 'state-chaos': 'SOBRECARGA' };
  $('heroMood').textContent = routeActive ? 'OBSERVANDO' : (moodLabels[state] || 'NEUTRO');
  $('auditorCueTag').textContent = auditorCueTagFor(state, routeActive);
  $('auditorCue').textContent = auditorCueFor(state, routeActive, suspicion);
  $('auditorDialogue').textContent = lastDialogue;
  $('heroQuote').textContent = routeActive ? 'Não vou tirar conclusões precipitadas. Ainda.' : (attention > 58 ? 'Espere. Essa resposta merece uma segunda leitura.' : 'Vamos começar. Espero que não seja necessário um segundo depoimento.');
  $('heroAuditor').setAttribute('aria-label', `Hiromi Higuruma, estado ${state.replace('state-', '')}`);
  $('quizAuditor').setAttribute('aria-label', `Hiromi Higuruma, estado ${state.replace('state-', '')}`);
}

const HIGURUMA_DIALOGUE = {
  dry: [
    '“Uma escolha objetiva. Não vejo motivo para prolongar esta parte.”',
    '“Registrado. Nem tudo precisa de um debate de quarenta minutos.”',
    '“Entendido. O cotidiano continua vencendo a imaginação por pontos.”',
    '“Razoável. A sessão segue sem incidentes.”',
    '“Uma resposta prática. Seria bom que alguns processos fossem assim.”'
  ],
  calm: [
    '“Certo. Isso faz sentido.”',
    '“Entendi. Vamos manter essa informação em contexto.”',
    '“Uma resposta direta. Obrigado por não transformar isso em um recurso.”',
    '“Anotado. Não há necessidade de criar um caso onde não existe um.”',
    '“Muito bem. Prossigamos.”'
  ],
  curious: [
    '“Interessante. O que levou você a essa escolha?”',
    '“Essa resposta tem mais camadas do que parecia à primeira vista.”',
    '“Vou guardar esse detalhe. Talvez faça sentido mais adiante.”',
    '“Não era a única possibilidade, mas é uma escolha interessante.”',
    '“Preciso reconsiderar a hipótese inicial. Só um pouco.”'
  ],
  amused: [
    '“Não estava no formulário, mas admito que é uma boa resposta.”',
    '“Isso foi específico. O relatório quase ganhou personalidade.”',
    '“Vou fingir que não achei graça. Continue.”',
    '“Tenho uma objeção. Infelizmente, é contra a minha própria vontade de rir.”',
    '“Essa resposta será registrada sem comentário. O comentário foi inevitável.”'
  ],
  impressed: [
    '“Espere. Quero reler essa parte.”',
    '“Você chegou a essa conclusão por conta própria?”',
    '“Essa escolha merece mais do que uma caixa marcada.”',
    '“Certo. Agora estou realmente prestando atenção.”',
    '“Não vou chamar isso de anomalia. Ainda não.”'
  ],
  reflective: [
    '“Há algo razoável nessa resposta. Não preciso concordar com tudo para reconhecer isso.”',
    '“É uma perspectiva defensável.”',
    '“A resposta parece simples, mas depende bastante do contexto.”',
    '“Não há veredito imediato. Prefiro entender antes de concluir.”'
  ]
};
function randomDialogue(mood = 'calm') {
  const pool = HIGURUMA_DIALOGUE[mood] || HIGURUMA_DIALOGUE.calm;
  const available = pool.filter((line) => !recentDialogueKeys.includes(line));
  const line = (available.length ? available : pool)[Math.floor(Math.random() * (available.length ? available.length : pool.length))];
  recentDialogueKeys.push(line);
  if (recentDialogueKeys.length > 6) recentDialogueKeys.shift();
  return line;
}
function optionMood(option) {
  if (option?.mood) return option.mood;
  const surprise = option?.surprise || 0;
  if (surprise >= 8) return 'impressed';
  if (surprise >= 3) return 'curious';
  if (surprise <= -2) return 'dry';
  return 'calm';
}
function answerReaction(question, option, value) {
  if (question.isFollowup) return option?.reaction || randomDialogue('reflective');
  if (question.id === 'power' && Array.isArray(value) && hasPowerCombo(value)) {
    return '“...” Higuruma interrompe a anotação. “Vou fazer algumas perguntas complementares.”';
  }
  // Alterna linhas de tom semelhante, sem repetir a mesma reação em cada sessão.
  return option?.reaction || randomDialogue(optionMood(option));
}
function observePatterns(question, value) {
  const currentOptions = question.type === 'multi' ? value : [value];
  const currentTags = currentOptions.flatMap((id) => getOption(question, id)?.tags || []);
  const pastTags = [];
  for (const pastQuestion of sessionQuestions) {
    if (pastQuestion.id === question.id || !answers[pastQuestion.id]) continue;
    const ids = pastQuestion.type === 'multi' ? answers[pastQuestion.id] : [answers[pastQuestion.id]];
    ids.forEach((id) => pastTags.push(...(getOption(pastQuestion, id)?.tags || [])));
  }
  const all = [...pastTags, ...currentTags];
  if (all.includes('researcher') && all.includes('builder') && (currentTags.includes('researcher') || currentTags.includes('builder'))) {
    return '“Você não ficou apenas na teoria, nem foi direto ao improviso. Primeiro observa, depois tenta construir. Vou guardar essa sequência.”';
  }
  if (all.includes('planner') && all.includes('improviser') && (currentTags.includes('planner') || currentTags.includes('improviser'))) {
    return '“Você gosta de estrutura, mas não parece tratar um plano como contrato irrevogável. Posso respeitar isso.”';
  }
  if (pastTags.filter((tag) => tag === 'deep_dive').length >= 1 && currentTags.includes('deep_dive')) {
    return '“Você voltou a investigar até o fim. Isso pode ser persistência ou uma incapacidade muito específica de deixar uma pergunta em paz.”';
  }
  if (all.includes('stories') && all.includes('experiment') && (currentTags.includes('stories') || currentTags.includes('experiment'))) {
    return '“Imaginação e experimentação. Uma combinação mais útil do que parece.”';
  }
  if (all.includes('practical') && all.includes('pattern_hunter') && currentTags.some((tag) => ['practical', 'pattern_hunter'].includes(tag))) {
    return '“Você alterna entre resolver o que está à frente e procurar um padrão maior. Não é uma contradição.”';
  }
  return '';
}

function previewAuditorReaction(question, option) {
  const element = $('quizAuditor');
  if (!element || !option) return;
  let state = 'state-neutral';
  const selected = question.type === 'multi' && Array.isArray(pendingSelection) ? pendingSelection : null;
  if (selected && hasPowerCombo(selected)) {
    state = 'state-suspicious';
    lastDialogue = '“...” Higuruma deixa a caneta imóvel. “Preciso confirmar algumas coisas.”';
  } else {
    const mood = optionMood(option);
    const stateForMood = { dry: 'state-bored', calm: 'state-neutral', reflective: 'state-neutral', curious: 'state-curious', amused: 'state-curious', impressed: 'state-fascinated' };
    state = question.isFollowup ? 'state-suspicious' : (stateForMood[mood] || 'state-neutral');
    if (question.type === 'multi') {
      const names = (selected || []).map((id) => getOption(question, id)?.text).filter(Boolean);
      lastDialogue = names.length ? `“${names.join(' + ')}.” Higuruma relê a seleção, sem emitir um veredito ainda.` : randomDialogue('calm');
    } else {
      lastDialogue = option.reaction || randomDialogue(mood);
    }
  }
  element.classList.remove(...AUDITOR_STATES, 'reaction-hit');
  element.classList.add(state);
  void element.offsetWidth;
  element.classList.add('reaction-hit');
  $('auditorDialogue').textContent = lastDialogue;
  $('auditorCueTag').textContent = auditorCueTagFor(state, hasPowerCombo(answers.power));
  $('auditorCue').textContent = auditorCueFor(state, hasPowerCombo(answers.power), computeSuspicion());
}
function contextualDialogue(question, value, option, wasPowerTrigger) {
  if (wasPowerTrigger) return '“...” Higuruma para de anotar e olha diretamente para a seleção. “Essa combinação exige uma averiguação complementar.”';
  if (question.id === 'follow_system_hack') return '“Interrupção de procedimento. Suas escolhas revelam uma tendência evidente: você não está apenas respondendo a um questionário, está tentando depurar a lógica por trás dele.”';
  if (question.id === 'follow_creative_chaos') return '“Alerta de sobrecarga criativa. Você abre abas infinitas, planeja tudo apenas para improvisar em cima dos escombros e constrói ferramentas que ninguém pediu.”';
  if (question.id === 'follow_too_normal') return '“Constatação atípica. Nenhuma anomalia, nenhum desvio, nenhuma excentricidade. Estatisticamente falando, tanta normalidade é o verdadeiro mistério.”';
  if (question.isFollowup) return answerReaction(question, option, value);
  const observation = observePatterns(question, value);
  if (observation) return observation;
  if (question.type === 'multi') {
    const names = value.map((id) => getOption(question, id)?.text).filter(Boolean);
    const mood = hasPowerCombo(value) ? 'impressed' : (value.length > 1 ? 'curious' : 'calm');
    return names.length ? `“${names.join(' + ')}.” ${randomDialogue(mood).replace(/^“|”$/g, '')}` : randomDialogue('calm');
  }
  return answerReaction(question, option, value);
}
function renderQuestion() {
  const flow = getFlow();
  if (stepIndex >= flow.length) { finishTest(); return; }
  const q = flow[stepIndex];
  const routeActive = hasPowerCombo(answers.power);
  $('quizScreen').classList.toggle('route-active', routeActive);

  // Banner dinâmico de combo ativo
  const activeBranch = getActiveBranchCombo();
  const banner = $('comboBanner');
  if (banner) {
    if (activeBranch && activeBranch.bannerText) {
      banner.textContent = activeBranch.bannerText;
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  $('progressFill').style.width = `${((stepIndex + 1) / flow.length) * 100}%`;
  $('progressLabel').textContent = `${String(stepIndex + 1).padStart(2, '0')} / ${String(flow.length).padStart(2, '0')}`;
  $('questionCategory').textContent = q.category;
  $('questionType').textContent = q.isFollowup ? 'ANÁLISE COMPLEMENTAR' : (q.type === 'multi' ? `ESCOLHA ATÉ ${q.maxSelect} PODERES` : 'ESCOLHA UMA RESPOSTA');
  $('questionTitle').textContent = q.title;
  $('questionDescription').textContent = q.description || '';
  $('selectionHint').textContent = q.type === 'multi' ? `Selecione até ${q.maxSelect} poderes. A combinação escolhida pode alterar a rota do questionário.` : 'Escolha a alternativa que mais combina com você.';
  const container = $('optionsContainer');
  container.innerHTML = '';
  optionsForQuestion(q).forEach((option, index) => {
    const chosen = q.type === 'multi' ? Array.isArray(pendingSelection) && pendingSelection.includes(option.id) : pendingSelection === option.id;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `option-button${chosen ? ' selected' : ''}`;
    button.setAttribute('aria-pressed', String(chosen));
    const marker = document.createElement('span');
    marker.className = 'option-marker';
    marker.textContent = chosen ? (q.type === 'multi' ? '✓' : '●') : (q.type === 'multi' ? '+' : String.fromCharCode(65 + index));
    const copy = document.createElement('span');
    copy.className = 'option-copy';
    const title = document.createElement('strong');
    title.textContent = option.text;
    copy.appendChild(title);
    if (option.detail) {
      const detail = document.createElement('small');
      detail.textContent = option.detail;
      copy.appendChild(detail);
    }
    button.append(marker, copy);
    button.addEventListener('click', () => {
      if (q.type === 'multi') {
        let current = Array.isArray(pendingSelection) ? [...pendingSelection] : [];
        if (current.includes(option.id)) current = current.filter((id) => id !== option.id);
        else if (current.length < q.maxSelect) current.push(option.id);
        else {
          showToast(`Você pode escolher no máximo ${q.maxSelect} opções.`);
          return;
        }
        pendingSelection = current;
      } else {
        pendingSelection = option.id;
      }
      renderOptionsOnly(q);
      previewAuditorReaction(q, option);
    });
    container.appendChild(button);
  });
  $('backButton').disabled = historyStack.length === 0;
  $('continueButton').disabled = q.type === 'multi' ? !(Array.isArray(pendingSelection) && pendingSelection.length > 0) : !pendingSelection;
  $('continueButton').innerHTML = `${stepIndex === flow.length - 1 ? 'FINALIZAR ANÁLISE' : 'REGISTRAR RESPOSTA'} <span aria-hidden="true">→</span>`;
  $('questionType').textContent = q.isFollowup ? 'ANÁLISE COMPLEMENTAR' : (q.type === 'multi' ? `ESCOLHA ATÉ ${q.maxSelect} PODERES` : 'ESCOLHA UMA RESPOSTA');
  applyAuditorState();
}
function renderOptionsOnly(q) {
  const buttons = [...$('optionsContainer').querySelectorAll('.option-button')];
  const orderedOptions = optionsForQuestion(q);
  buttons.forEach((button, index) => {
    const option = orderedOptions[index];
    const chosen = q.type === 'multi' ? Array.isArray(pendingSelection) && pendingSelection.includes(option.id) : pendingSelection === option.id;
    button.classList.toggle('selected', chosen);
    button.setAttribute('aria-pressed', String(chosen));
    button.querySelector('.option-marker').textContent = chosen ? (q.type === 'multi' ? '✓' : '●') : (q.type === 'multi' ? '+' : String.fromCharCode(65 + index));
  });
  $('continueButton').disabled = q.type === 'multi' ? !(Array.isArray(pendingSelection) && pendingSelection.length > 0) : !pendingSelection;
}
function answerQuestion() {
  const flow = getFlow();
  const q = flow[stepIndex];
  if (!q || (q.type === 'multi' ? !(Array.isArray(pendingSelection) && pendingSelection.length) : !pendingSelection)) return;
  const value = Array.isArray(pendingSelection) ? [...pendingSelection] : pendingSelection;
  answers[q.id] = value;
  historyStack.push({ id: q.id, value });
  const wasPowerTrigger = q.id === 'power' && hasPowerCombo(value);
  const option = q.type === 'multi' ? null : getOption(q, value);
  lastDialogue = contextualDialogue(q, value, option, wasPowerTrigger);
  stepIndex += 1;
  pendingSelection = null;
  if (stepIndex >= getFlow().length) finishTest();
  else renderQuestion();
}
function goBack() {
  if (!historyStack.length) return;
  const previous = historyStack.pop();
  delete answers[previous.id];
  stepIndex = Math.max(0, stepIndex - 1);
  pendingSelection = Array.isArray(previous.value) ? [...previous.value] : previous.value;
  if (previous.id === 'power') {
    FOLLOW_UPS.forEach((q) => { delete answers[q.id]; });
    lastDialogue = '“Voltamos à escolha do superpoder. O registro complementar foi removido.”';
  } else if (['follow_system_hack', 'follow_creative_chaos', 'follow_too_normal'].includes(previous.id)) {
    lastDialogue = '“Retornando da averiguação especial. O rumo anterior foi restaurado.”';
  } else {
    lastDialogue = '“Retornando à resposta anterior. Estou revisando o registro.”';
  }
  renderQuestion();
}
function getClassification(score) {
  if (score <= 24) return { tag: 'PADRÃO HUMANO', title: 'um <em>padrão humano.</em>', description: 'Suas escolhas ficaram próximas do padrão definido pelas regras lúdicas do Rarômetro. O auditor não parece surpreso, o que é exatamente o que alguém surpreso diria.', verdict: '“Nenhuma anomalia crítica detectada. O relatório também poderia ter sido um bilhete.”', state: 'state-bored' };
  if (score <= 49) return { tag: 'DESVIO LEVE', title: 'um <em>desvio leve.</em>', description: 'Algumas escolhas fugiram do esperado, mas o sistema ainda consegue manter uma postura profissional. O auditor está tentando não parecer interessado.', verdict: '“Existe algo aqui. Ainda não sei se justifica uma segunda página.”', state: 'state-neutral' };
  if (score <= 74) return { tag: 'ANOMALIA AMBULANTE', title: 'uma <em>anomalia ambulante.</em>', description: 'As respostas produziram várias combinações que merecem atenção dentro das regras do jogo. O auditor já parou de fingir que está só cumprindo o expediente.', verdict: '“Recomendo uma análise adicional. Por motivos estritamente profissionais.”', state: 'state-curious' };
  return { tag: 'ERRO DE CLASSIFICAÇÃO', title: 'um <em>erro de classificação.</em>', description: 'Você acumulou pontuação e combinações suficientes para deixar o relatório desconfortavelmente interessante. O auditor já abriu uma segunda tela.', verdict: '“Você é real mesmo? ...Não responda. Preciso organizar minhas anotações.”', state: 'state-fascinated' };
}
function getPersonalizedAuditorNote(result, routeActive, suspicion, classification) {
  if (routeActive && suspicion <= 0) {
    return '“Após reavaliar a hipótese inicial, concluí que fui precipitado. Sua pontuação está no relatório. Não comente este episódio.”';
  }
  if (routeActive && suspicion < 6) {
    return '“A hipótese permanece inconclusiva. A classificação foi emitida, mas mantive uma observação confidencial.”';
  }
  const comboMatches = (result.comboMatches || []).filter((item) => !item.isPowerCombo);
  if (comboMatches.length > 0) {
    const primary = comboMatches[0];
    if (primary.id === 'system_breaker') {
      return '“Você investigou as regras, procurou os limites do formulário e respondeu como um verdadeiro metagamer. Admito que o tribunal se sentiu auditado por você.”';
    }
    if (primary.id === 'chaos_architect') {
      return '“Seu perfil une planejamento e caos em proporções alarmantes. Você não quer apenas responder; você quer ver até onde a estrutura aguenta o impacto.”';
    }
    if (primary.id === 'ultra_normal') {
      return '“Seu pragmatismo é quase uma declaração de princípios. No meio de tanta gente querendo parecer exótica, sua normalidade é a coisa mais rara que vi hoje.”';
    }
    if (primary.id === 'investigator_builder') {
      return '“Você não se contenta em pesquisar o problema: você tenta criar um protótipo para ele. Reconheço e temo essa disposição.”';
    }
    if (primary.id === 'systems_builder') {
      return '“Seu apreço por mecanismos internos se uniu ao hábito de construir soluções. Isso explica muita coisa no seu formulário.”';
    }
    if (primary.id === 'planner_improviser') {
      return '“Você organiza planos minuciosos apenas para ter o prazer de improvisar em cima deles. Um caos estruturado admirável.”';
    }
    if (primary.id === 'pattern_diver') {
      return '“Você vê padrões onde a maioria só vê ruído e vai até o fundo da toca do coelho. O relatório sentiu o impacto.”';
    }
  }
  const dims = result.dimensions || {};
  let topDim = 'habits';
  let maxDimVal = -1;
  for (const d of DIMENSIONS) {
    if ((dims[d.key] || 0) > maxDimVal) {
      maxDimVal = dims[d.key] || 0;
      topDim = d.key;
    }
  }
  if (topDim === 'curiosity' && maxDimVal >= 50) {
    return '“Sua curiosidade atingiu níveis que deixaram o sistema em alerta. Você claramente não sabe ignorar uma informação estranha.”';
  }
  if (topDim === 'creativity' && maxDimVal >= 50) {
    return '“Sua propensão a criar e executar coisas que ninguém solicitou é estatisticamente perturbadora. Continue.”';
  }
  if (topDim === 'interests' && maxDimVal >= 50) {
    return '“Seus interesses fogem da média de maneira consistente. O subsistema de categorização quase pediu um intervalo.”';
  }
  return '“O expediente terminou. Minha curiosidade profissional sobre seus hábitos cotidianos, infelizmente, não.”';
}

function finishTest() {
  const routeActive = hasPowerCombo(answers.power);
  const suspicion = computeSuspicion();
  lastResult = computeScore();
  if (routeActive && suspicion >= 6) {
    $('normalResult').classList.add('hidden');
    $('secretResult').classList.remove('hidden');
    $('secretDialogue').textContent = suspicion >= 9 ? '“Eu normalmente atribuo uma pontuação a todos os indivíduos analisados.”' : '“A coleta foi concluída. O relatório ficará retido enquanto reviso algumas respostas.”';
    $('secretLastLine').textContent = suspicion >= 9 ? '“A análise terminou. A minha curiosidade, infelizmente, não.”' : '“Não é uma acusação. É uma pausa administrativa extraordinariamente específica.”';
    $('topStatus').textContent = 'RELATÓRIO RETIDO';
    showScreen('result');
    $('topStatus').textContent = 'RELATÓRIO RETIDO';
    applyAuditorState();
    return;
  }
  $('secretResult').classList.add('hidden');
  $('normalResult').classList.remove('hidden');
  const c = getClassification(lastResult.score);
  $('resultClassTag').textContent = c.tag;
  $('resultTitle').innerHTML = `Você é ${c.title}`;
  $('resultDescription').textContent = c.description;
  $('scoreValue').textContent = String(lastResult.score);
  $('resultGaugeFill').style.width = `${lastResult.score}%`;
  $('resultVerdict').textContent = c.verdict;
  $('resultAuditorText').textContent = getPersonalizedAuditorNote(lastResult, routeActive, suspicion, c);
  if (routeActive && suspicion <= 0) {
    $('resultVerdict').textContent = '“A hipótese foi encerrada. Não interprete isso como uma admissão de erro.”';
  } else if (routeActive && suspicion < 6) {
    $('resultVerdict').textContent = '“O índice foi emitido. A investigação, tecnicamente, foi encerrada. Tecnicamente.”';
  }
  renderDimensions(lastResult.dimensions);
  renderCombination(lastResult.comboMatches);
  showScreen('result');
  applyAuditorState();
  $('resultAuditor').classList.remove(...AUDITOR_STATES);
  $('resultAuditor').classList.add(routeActive && suspicion > 0 ? 'state-suspicious' : c.state);
}
function renderDimensions(values) {
  const container = $('dimensionBars');
  container.innerHTML = '';
  DIMENSIONS.forEach((dimension) => {
    const row = document.createElement('div');
    row.className = 'dimension-row';
    const name = document.createElement('span'); name.className = 'dimension-name'; name.textContent = dimension.label;
    const track = document.createElement('div'); track.className = 'dimension-track';
    const fill = document.createElement('div'); fill.className = 'dimension-fill'; fill.style.width = `${values[dimension.key] || 0}%`; track.appendChild(fill);
    const value = document.createElement('span'); value.className = 'dimension-value'; value.textContent = String(values[dimension.key] || 0).padStart(2, '0');
    row.append(name, track, value); container.appendChild(row);
  });
}
function renderCombination(matches) {
  const combo = $('combinationCard');
  const primary = matches.find((item) => !item.isPowerCombo) || matches[0];
  if (!primary) { combo.classList.add('hidden'); return; }
  combo.classList.remove('hidden');
  $('combinationTitle').textContent = primary.title;
  $('combinationText').textContent = primary.text;
}
async function shareReport() {
  if (!lastResult) return;
  const c = getClassification(lastResult.score);
  const text = `Meu resultado no RARÔMETRO: ${lastResult.score}/100 — ${c.tag}.\n"${c.verdict.replace(/[“”]/g, '')}"\nFaça sua própria análise: ${window.location.href}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Meu relatório Rarômetro', text });
      $('shareFeedback').textContent = 'RELATÓRIO COMPARTILHADO.';
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      $('shareFeedback').textContent = 'RELATÓRIO COPIADO PARA A ÁREA DE TRANSFERÊNCIA.';
      showToast('Relatório copiado. Agora vá compartilhar sua anomalia.');
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text; textarea.setAttribute('readonly', ''); textarea.style.position = 'fixed'; textarea.style.opacity = '0';
      document.body.appendChild(textarea); textarea.select();
      const copied = document.execCommand('copy'); textarea.remove();
      if (copied) { $('shareFeedback').textContent = 'RELATÓRIO COPIADO.'; showToast('Relatório copiado para a área de transferência.'); }
      else { showToast('Não foi possível copiar automaticamente. Selecione o texto no relatório.'); }
    }
    setTimeout(() => {
      const fb = $('shareFeedback');
      if (fb) fb.textContent = '';
    }, 4000);
  } catch (error) {
    if (error && error.name === 'AbortError') return;
    showToast('O compartilhamento não está disponível neste navegador.');
  }
}
function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2600);
}

$('startButton').addEventListener('click', startTest);
$('continueButton').addEventListener('click', answerQuestion);
$('backButton').addEventListener('click', goBack);
$('restartButton').addEventListener('click', startTest);
$('secretRestartButton').addEventListener('click', startTest);
$('closeCaseButton').addEventListener('click', () => {
  answers = Object.create(null);
  historyStack = [];
  stepIndex = 0;
  pendingSelection = null;
  lastDialogue = '“Vamos começar. Espero que não seja necessário um segundo depoimento.”';
  lastResult = null;
  showScreen('landing');
  $('heroAuditor').classList.remove(...AUDITOR_STATES);
  $('heroAuditor').classList.add('state-bored');
  $('heroMood').textContent = 'ENTEDIADO';
  $('heroQuote').textContent = 'Caso encerrado e arquivado. O auditor preferiu fingir que nada aconteceu.';
  showToast('Caso encerrado. O auditor arquivou seu relatório confidencial.');
});
$('shareButton').addEventListener('click', shareReport);
$('brandHome').addEventListener('click', (event) => {
  event.preventDefault();
  answers = Object.create(null); historyStack = []; stepIndex = 0; pendingSelection = null;
  showScreen('landing');
  $('heroAuditor').classList.remove(...AUDITOR_STATES); $('heroAuditor').classList.add('state-bored');
  $('heroMood').textContent = 'ENTEDIADO';
  $('heroQuote').textContent = 'Vamos começar. Espero que não seja necessário um segundo depoimento.';
});

// Suporte a teclado: números 1-8 ou letras A-H para selecionar, Enter para confirmar, Escape para voltar
window.addEventListener('keydown', (event) => {
  if (!screens.quiz || screens.quiz.classList.contains('hidden')) return;
  const flow = getFlow();
  const q = flow[stepIndex];
  if (!q) return;

  let optIndex = -1;
  if (event.key >= '1' && event.key <= '8') {
    optIndex = parseInt(event.key, 10) - 1;
  } else {
    const key = event.key.toUpperCase();
    if (key.length === 1 && key >= 'A' && key <= 'H') {
      optIndex = key.charCodeAt(0) - 65;
    }
  }

  if (optIndex >= 0 && optIndex < q.options.length) {
    event.preventDefault();
    const option = optionsForQuestion(q)[optIndex];
    if (q.type === 'multi') {
      let current = Array.isArray(pendingSelection) ? [...pendingSelection] : [];
      if (current.includes(option.id)) current = current.filter((id) => id !== option.id);
      else if (current.length < q.maxSelect) current.push(option.id);
      else {
        showToast(`Você pode escolher no máximo ${q.maxSelect} opções.`);
        return;
      }
      pendingSelection = current;
    } else {
      pendingSelection = option.id;
    }
    renderOptionsOnly(q);
    previewAuditorReaction(q, option);
    return;
  }

  if (event.key === 'Enter') {
    const btn = $('continueButton');
    if (btn && !btn.disabled) {
      event.preventDefault();
      answerQuestion();
    }
    return;
  }

  if (event.key === 'Escape' || (event.key === 'Backspace' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA')) {
    const btn = $('backButton');
    if (btn && !btn.disabled) {
      event.preventDefault();
      goBack();
    }
  }
});

// Estado inicial: o auditor já está cansado e o usuário ainda nem começou.
applyAuditorState();
