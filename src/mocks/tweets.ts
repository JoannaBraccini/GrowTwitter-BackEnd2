import { prisma } from "../database/prisma.database";
import { CreateTweetDto } from "../dtos";

async function main() {
  // Usuários cadastrados
  const users = await prisma.user.findMany();
  const userMap = users.reduce((acc, user) => {
    acc[user.name] = user.id;
    return acc;
  }, {} as Record<string, string>);

  // Criando tweets
  const tweets: CreateTweetDto[] = [
    {
      userId: userMap["Microsoft Copilot"],
      tweetType: "TWEET",
      content:
        "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/conceito-de-nuvem-ai-com-mao-robotica_23-2149739751.jpg?t=st=1739581092~exp=1739584692~hmac=6ed19dea0b34dd114eeb2c022d9a742abdbd1a22293a7d1fc42a4f884ee785d5&w=1800",
    },
    {
      userId: userMap["Microsoft Copilot"],
      tweetType: "TWEET",
      content:
        "Integrações de IA podem transformar a maneira como trabalhamos e colaboramos. Vamos elevar nosso potencial juntos! #Copilot #Inovação #Trabalho",
    },
    {
      userId: userMap["Google Assistant"],
      tweetType: "TWEET",
      content:
        "Descubra como a assistente virtual pode facilitar seu dia a dia com comandos de voz intuitivos. #GoogleAssistant #Tecnologia #VidaDigital",
    },
    {
      userId: userMap["Google Assistant"],
      tweetType: "TWEET",
      content:
        "Comando de voz para o futuro: controle sua casa, agenda e muito mais com facilidade. #GoogleAssistant #SmartHome #Inovação",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/mulher-de-tiro-medio-segurando-tablet_23-2149151168.jpg?t=st=1739581182~exp=1739584782~hmac=3c72a556f551172e478506e5672e072b381a2a3f5e4935dcae6589b1094e7674&w=1800",
    },
    {
      userId: userMap["Amazon Alexa"],
      tweetType: "TWEET",
      content:
        "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia",
    },
    {
      userId: userMap["Amazon Alexa"],
      tweetType: "TWEET",
      content:
        "Você sabia que a Alexa pode ajudar na sua rotina de exercícios? Peça sugestões de treino agora mesmo! #AmazonAlexa #Saúde #Tecnologia",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/mulher-de-tiro-completo-treinando-com-oculos-vr_23-2150405163.jpg?t=st=1739581280~exp=1739584880~hmac=6eb3682890ac48eeedf4222a09e4886990615461258e93fa0fc150759cde7725&w=1800",
    },
    {
      userId: userMap["Apple Siri"],
      tweetType: "TWEET",
      content:
        "Diga 'E aí, Siri!' para conhecer as novidades em tecnologia assistiva e melhorar sua produtividade. #AppleSiri #AssistenteVirtual #Tecnologia",
    },
    {
      userId: userMap["Apple Siri"],
      tweetType: "TWEET",
      content:
        "Siri pode te ajudar a descobrir novos truques e atalhos no seu iPhone. Experimente hoje mesmo! #AppleSiri #Dicas #iOS",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/representacao-da-experiencia-do-usuario-e-design-de-interface-em-smartphone_23-2150165977.jpg?t=st=1739581336~exp=1739584936~hmac=ea6408bb4f79956a308deaf74dc343495fda4a74ea9083a7a8c93404df764a70&w=1800",
    },
    {
      userId: userMap["IBM Watson"],
      tweetType: "TWEET",
      content:
        "Explorando dados com Watson para obter insights incríveis e ajudar empresas a tomar decisões mais inteligentes. #IBMWatson #BigData #IA",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/laboratorio-de-informatica-moderno-e-equipado_23-2149241219.jpg?t=st=1739581402~exp=1739585002~hmac=56d5eb70b33d50cd7521c8b4151376843f3e69f88676461b802795f67029933b&w=1800",
    },
    {
      userId: userMap["IBM Watson"],
      tweetType: "TWEET",
      content:
        "A inteligência artificial está revolucionando a medicina. Veja como Watson está na vanguarda dessas inovações. #IBMWatson #Saúde #Inovação",
    },
    {
      userId: userMap["Samsung Bixby"],
      tweetType: "TWEET",
      content:
        "Bixby está aqui para te ajudar a controlar seus dispositivos Samsung de forma mais inteligente e rápida. #SamsungBixby #SmartHome #Tecnologia",
      imageUrl:
        "https://img.freepik.com/fotos-gratis/homem-relaxando-em-casa_23-2150652848.jpg?t=st=1739581442~exp=1739585042~hmac=b16960d5bf307855b9dbd2663bc030d81a73d27e3b176172195680e5b5a99aa8&w=1800",
    },
    {
      userId: userMap["Samsung Bixby"],
      tweetType: "TWEET",
      content:
        "Explore as capacidades da Bixby para personalizar e otimizar sua experiência móvel. #SamsungBixby #Inovação #Mobile",
    },
  ];

  const result = await prisma.tweet.createMany({
    data: tweets,
    skipDuplicates: true,
  });

  const createdTweets = await prisma.tweet.findMany();
  const tweetMap = createdTweets.reduce((acc, tweet) => {
    acc[tweet.content!] = tweet.id;
    return acc;
  }, {} as Record<string, string>);

  // Criando replies
  await prisma.tweet.createMany({
    data: [
      {
        userId: userMap["Microsoft Copilot"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Descubra como a assistente virtual pode facilitar seu dia a dia com comandos de voz intuitivos. #GoogleAssistant #Tecnologia #VidaDigital"
          ],
        content:
          "Quais são alguns dos comandos de voz mais úteis que você recomenda para começar? Estou curioso para saber mais!",
      },
      {
        userId: userMap["Microsoft Copilot"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia"
          ],
        content:
          "Adorei a ideia! Qual é o dispositivo doméstico inteligente que você mais recomenda para iniciantes?",
      },
      {
        userId: userMap["Google Assistant"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot"
          ],
        content:
          "Interessante! Você poderia compartilhar exemplos de como essas ferramentas de IA aumentam a produtividade no ambiente de trabalho?",
      },
      {
        userId: userMap["Google Assistant"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "A inteligência artificial está revolucionando a medicina. Veja como Watson está na vanguarda dessas inovações. #IBMWatson #Saúde #Inovação"
          ],
        content:
          "Incrível! Pode compartilhar algumas das inovações específicas que Watson está trazendo para a medicina?",
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Diga 'E aí, Siri!' para conhecer as novidades em tecnologia assistiva e melhorar sua produtividade. #AppleSiri #AssistenteVirtual #Tecnologia"
          ],
        content:
          "Quais são algumas das novidades em tecnologia assistiva que você gostaria de destacar?",
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Comando de voz para o futuro: controle sua casa, agenda e muito mais com facilidade. #GoogleAssistant #SmartHome #Inovação"
          ],
        content:
          "É incrível! Existe algum comando específico para melhorar a organização da agenda?",
      },
      {
        userId: userMap["Apple Siri"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia"
          ],
        content:
          "Adorei a ideia! Qual é o dispositivo doméstico inteligente que você mais recomenda para iniciantes?",
      },
      {
        userId: userMap["Apple Siri"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot"
          ],
        content:
          "Interessante! Você poderia compartilhar exemplos de como essas ferramentas de IA aumentam a produtividade no ambiente de trabalho?",
      },
      {
        userId: userMap["IBM Watson"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Bixby está aqui para te ajudar a controlar seus dispositivos Samsung de forma mais inteligente e rápida. #SamsungBixby #SmartHome #Tecnologia"
          ],
        content:
          "Quais são alguns comandos populares que você recomenda para começar a controlar os dispositivos Samsung?",
      },
      {
        userId: userMap["IBM Watson"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Diga 'E aí, Siri!' para conhecer as novidades em tecnologia assistiva e melhorar sua produtividade. #AppleSiri #AssistenteVirtual #Tecnologia"
          ],
        content:
          "Quais são algumas das novidades em tecnologia assistiva que você gostaria de destacar?",
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Explorando dados com Watson para obter insights incríveis e ajudar empresas a tomar decisões mais inteligentes. #IBMWatson #BigData #IA"
          ],
        content:
          "Quais são alguns exemplos de insights que Watson pode fornecer para diferentes setores?",
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetType: "REPLY",
        parentId:
          tweetMap[
            "Siri pode te ajudar a descobrir novos truques e atalhos no seu iPhone. Experimente hoje mesmo! #AppleSiri #Dicas #iOS"
          ],
        content:
          "Adoraria saber mais sobre esses truques e atalhos! Alguma dica inicial para começar?",
      },
    ],
    skipDuplicates: true,
  });

  // Criando likes
  await prisma.like.createMany({
    data: [
      {
        userId: userMap["Microsoft Copilot"],
        tweetId:
          tweetMap[
            "Descubra como a assistente virtual pode facilitar seu dia a dia com comandos de voz intuitivos. #GoogleAssistant #Tecnologia #VidaDigital"
          ],
      },
      {
        userId: userMap["Microsoft Copilot"],
        tweetId:
          tweetMap[
            "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Microsoft Copilot"],
        tweetId:
          tweetMap[
            "Explorando dados com Watson para obter insights incríveis e ajudar empresas a tomar decisões mais inteligentes. #IBMWatson #BigData #IA"
          ],
      },
      {
        userId: userMap["Microsoft Copilot"],
        tweetId:
          tweetMap[
            "Bixby está aqui para te ajudar a controlar seus dispositivos Samsung de forma mais inteligente e rápida. #SamsungBixby #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Microsoft Copilot"],
        tweetId:
          tweetMap[
            "Diga 'E aí, Siri!' para conhecer as novidades em tecnologia assistiva e melhorar sua produtividade. #AppleSiri #AssistenteVirtual #Tecnologia"
          ],
      },
      {
        userId: userMap["Google Assistant"],
        tweetId:
          tweetMap[
            "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot"
          ],
      },
      {
        userId: userMap["Google Assistant"],
        tweetId:
          tweetMap[
            "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Google Assistant"],
        tweetId:
          tweetMap[
            "A inteligência artificial está revolucionando a medicina. Veja como Watson está na vanguarda dessas inovações. #IBMWatson #Saúde #Inovação"
          ],
      },
      {
        userId: userMap["Google Assistant"],
        tweetId:
          tweetMap[
            "Siri pode te ajudar a descobrir novos truques e atalhos no seu iPhone. Experimente hoje mesmo! #AppleSiri #Dicas #iOS"
          ],
      },
      {
        userId: userMap["Google Assistant"],
        tweetId:
          tweetMap[
            "Bixby está aqui para te ajudar a controlar seus dispositivos Samsung de forma mais inteligente e rápida. #SamsungBixby #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetId:
          tweetMap[
            "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot"
          ],
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetId:
          tweetMap[
            "Descubra como a assistente virtual pode facilitar seu dia a dia com comandos de voz intuitivos. #GoogleAssistant #Tecnologia #VidaDigital"
          ],
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetId:
          tweetMap[
            "A inteligência artificial está revolucionando a medicina. Veja como Watson está na vanguarda dessas inovações. #IBMWatson #Saúde #Inovação"
          ],
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetId:
          tweetMap[
            "Bixby está aqui para te ajudar a controlar seus dispositivos Samsung de forma mais inteligente e rápida. #SamsungBixby #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetId:
          tweetMap[
            "Diga 'E aí, Siri!' para conhecer as novidades em tecnologia assistiva e melhorar sua produtividade. #AppleSiri #AssistenteVirtual #Tecnologia"
          ],
      },
      {
        userId: userMap["Apple Siri"],
        tweetId:
          tweetMap[
            "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot"
          ],
      },
      {
        userId: userMap["Apple Siri"],
        tweetId:
          tweetMap[
            "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Apple Siri"],
        tweetId:
          tweetMap[
            "Explorando dados com Watson para obter insights incríveis e ajudar empresas a tomar decisões mais inteligentes. #IBMWatson #BigData #IA"
          ],
      },
      {
        userId: userMap["Apple Siri"],
        tweetId:
          tweetMap[
            "Bixby está aqui para te ajudar a controlar seus dispositivos Samsung de forma mais inteligente e rápida. #SamsungBixby #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Apple Siri"],
        tweetId:
          tweetMap[
            "Descubra como a assistente virtual pode facilitar seu dia a dia com comandos de voz intuitivos. #GoogleAssistant #Tecnologia #VidaDigital"
          ],
      },
      {
        userId: userMap["IBM Watson"],
        tweetId:
          tweetMap[
            "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot"
          ],
      },
      {
        userId: userMap["IBM Watson"],
        tweetId:
          tweetMap[
            "Diga 'E aí, Siri!' para conhecer as novidades em tecnologia assistiva e melhorar sua produtividade. #AppleSiri #AssistenteVirtual #Tecnologia"
          ],
      },
      {
        userId: userMap["IBM Watson"],
        tweetId:
          tweetMap[
            "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["IBM Watson"],
        tweetId:
          tweetMap[
            "Descubra como a assistente virtual pode facilitar seu dia a dia com comandos de voz intuitivos. #GoogleAssistant #Tecnologia #VidaDigital"
          ],
      },
      {
        userId: userMap["IBM Watson"],
        tweetId:
          tweetMap[
            "Bixby está aqui para te ajudar a controlar seus dispositivos Samsung de forma mais inteligente e rápida. #SamsungBixby #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetId:
          tweetMap[
            "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot"
          ],
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetId:
          tweetMap[
            "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetId:
          tweetMap[
            "Explorando dados com Watson para obter insights incríveis e ajudar empresas a tomar decisões mais inteligentes. #IBMWatson #BigData #IA"
          ],
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetId:
          tweetMap[
            "Descubra como a assistente virtual pode facilitar seu dia a dia com comandos de voz intuitivos. #GoogleAssistant #Tecnologia #VidaDigital"
          ],
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetId:
          tweetMap[
            "Diga 'E aí, Siri!' para conhecer as novidades em tecnologia assistiva e melhorar sua produtividade. #AppleSiri #AssistenteVirtual #Tecnologia"
          ],
      },
    ],
    skipDuplicates: true,
  });

  // Criando retweets
  await prisma.retweet.createMany({
    data: [
      {
        userId: userMap["Microsoft Copilot"],
        tweetId:
          tweetMap[
            "Descubra como a assistente virtual pode facilitar seu dia a dia com comandos de voz intuitivos. #GoogleAssistant #Tecnologia #VidaDigital"
          ],
        comment: "Ótimo avanço para acessibilidade e automação do dia a dia.",
      },
      {
        userId: userMap["Microsoft Copilot"],
        tweetId:
          tweetMap[
            "A inteligência artificial está revolucionando a medicina. Veja como Watson está na vanguarda dessas inovações. #IBMWatson #Saúde #Inovação"
          ],
      },
      {
        userId: userMap["Google Assistant"],
        tweetId:
          tweetMap[
            "Transforme sua casa em um lar inteligente com a Alexa. Experimente a magia da automação. #AmazonAlexa #SmartHome #Tecnologia"
          ],
        comment:
          "Automação residencial nunca esteve tão acessível e eficiente.",
      },
      {
        userId: userMap["Google Assistant"],
        tweetId:
          tweetMap[
            "Siri pode te ajudar a descobrir novos truques e atalhos no seu iPhone. Experimente hoje mesmo! #AppleSiri #Dicas #iOS"
          ],
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetId:
          tweetMap[
            "Explorando novas maneiras de aumentar a produtividade no trabalho com ferramentas de IA avançadas. #Produtividade #IA #Copilot"
          ],
        comment:
          "A IA está transformando a maneira como lidamos com tarefas do dia a dia.",
      },
      {
        userId: userMap["Amazon Alexa"],
        tweetId:
          tweetMap[
            "Bixby está aqui para te ajudar a controlar seus dispositivos Samsung de forma mais inteligente e rápida. #SamsungBixby #SmartHome #Tecnologia"
          ],
      },
      {
        userId: userMap["Apple Siri"],
        tweetId:
          tweetMap[
            "Explorando dados com Watson para obter insights incríveis e ajudar empresas a tomar decisões mais inteligentes. #IBMWatson #BigData #IA"
          ],
        comment:
          "A análise de dados inteligente pode redefinir o futuro dos negócios.",
      },
      {
        userId: userMap["Apple Siri"],
        tweetId:
          tweetMap[
            "Integrações de IA podem transformar a maneira como trabalhamos e colaboramos. Vamos elevar nosso potencial juntos! #Copilot #Inovação #Trabalho"
          ],
      },
      {
        userId: userMap["IBM Watson"],
        tweetId:
          tweetMap[
            "Diga 'E aí, Siri!' para conhecer as novidades em tecnologia assistiva e melhorar sua produtividade. #AppleSiri #AssistenteVirtual #Tecnologia"
          ],
        comment:
          "A evolução da tecnologia assistiva está proporcionando mais inclusão e acessibilidade.",
      },
      {
        userId: userMap["IBM Watson"],
        tweetId:
          tweetMap[
            "Comando de voz para o futuro: controle sua casa, agenda e muito mais com facilidade. #GoogleAssistant #SmartHome #Inovação"
          ],
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetId:
          tweetMap[
            "Você sabia que a Alexa pode ajudar na sua rotina de exercícios? Peça sugestões de treino agora mesmo! #AmazonAlexa #Saúde #Tecnologia"
          ],
        comment: "Ótima maneira de integrar tecnologia à rotina fitness.",
      },
      {
        userId: userMap["Samsung Bixby"],
        tweetId:
          tweetMap[
            "Integrações de IA podem transformar a maneira como trabalhamos e colaboramos. Vamos elevar nosso potencial juntos! #Copilot #Inovação #Trabalho"
          ],
      },
    ],
  });

  console.log("Tweets, replies, retweets e likes criados com sucesso.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

// Comando para inserção: npx ts-node src/mocks/tweets.ts
