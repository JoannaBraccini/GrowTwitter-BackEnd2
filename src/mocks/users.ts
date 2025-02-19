import { prisma } from "../database/prisma.database";
import { Bcrypt } from "../utils/bcrypt";

async function main() {
  const bcrypt = new Bcrypt();

  const users = [
    {
      name: "Microsoft Copilot",
      email: "copilot@microsoft.com",
      username: "copilot",
      password: "senha123",
      // bio: "Seu assistente de produtividade com IA.",
    },
    {
      name: "Google Assistant",
      email: "assistant@google.com",
      username: "googleassistant",
      password: "senha123",
      // bio: "Sempre pronto para ajudar.",
    },
    {
      name: "Amazon Alexa",
      email: "alexa@amazon.com",
      username: "amazonalexa",
      password: "senha123",
      // bio: "Facilitando sua vida com comandos de voz.",
    },
    {
      name: "Apple Siri",
      email: "siri@apple.com",
      username: "applesiri",
      password: "senha123",
      // bio: "Seu assistente pessoal inteligente da Apple.",
    },
    {
      name: "Samsung Bixby",
      email: "bixby@samsung.com",
      username: "bixbysamsung",
      password: "senha123",
      // bio: "Um novo jeito de interagir com seu dispositivo Samsung.",
    },
    {
      name: "IBM Watson",
      email: "watson@ibm.com",
      username: "ibmwatson",
      password: "senha123",
      // bio: "Líder em inteligência artificial e computação cognitiva.",
    },
  ];

  // Gerar hash para as senhas
  for (let user of users) {
    user.password = await bcrypt.generateHash(user.password);
  }

  // Inserir usuários no banco
  await prisma.user.createMany({ data: users });
  console.log("Usuários inseridos com sucesso.");

  // Buscar os usuários inseridos para mapear os IDs
  const usersFromDb = await prisma.user.findMany();
  const userMap = usersFromDb.reduce((acc, user) => {
    acc[user.name] = user.id;
    return acc;
  }, {} as Record<string, string>);

  const bios = [
    {
      name: "Microsoft Copilot",
      bio: "Seu assistente de produtividade com IA.",
    },
    {
      name: "Google Assistant",
      bio: "Sempre pronto para ajudar.",
    },
    {
      name: "Amazon Alexa",
      bio: "Facilitando sua vida com comandos de voz.",
    },
    {
      name: "Apple Siri",
      bio: "Seu assistente pessoal inteligente da Apple.",
    },
    {
      name: "Samsung Bixby",
      bio: "Um novo jeito de interagir com seu dispositivo Samsung.",
    },
    {
      name: "IBM Watson",
      bio: "Líder em inteligência artificial e computação cognitiva.",
    },
  ];

  // Atualizar todos os usuários com a bio
  const updatePromises = bios.map(async (user) => {
    const userId = userMap[user.name]; // Usando o mapa para buscar o ID

    if (userId) {
      return prisma.user.update({
        where: { id: userId },
        data: {
          bio: user.bio,
        },
      });
    }
  });

  // Executar todas as atualizações
  await Promise.all(updatePromises);
  console.log("Usuários atualizados com sucesso.");

  // Criando follows com base no mapeamento de usuários
  const follows = [
    { followerId: "Microsoft Copilot", followedId: "Google Assistant" },
    { followerId: "Microsoft Copilot", followedId: "Amazon Alexa" },
    { followerId: "Google Assistant", followedId: "Microsoft Copilot" },
    { followerId: "Google Assistant", followedId: "Apple Siri" },
    { followerId: "Amazon Alexa", followedId: "Apple Siri" },
    { followerId: "Amazon Alexa", followedId: "IBM Watson" },
    { followerId: "Apple Siri", followedId: "Microsoft Copilot" },
    { followerId: "Apple Siri", followedId: "IBM Watson" },
    { followerId: "IBM Watson", followedId: "Microsoft Copilot" },
    { followerId: "IBM Watson", followedId: "Samsung Bixby" },
    { followerId: "Samsung Bixby", followedId: "Google Assistant" },
    { followerId: "Samsung Bixby", followedId: "Amazon Alexa" },
  ];

  // Substituir os nomes pelos IDs correspondentes
  const followsWithIds = follows.map((follow) => ({
    followerId: userMap[follow.followerId], // Substitui pelo ID real
    followedId: userMap[follow.followedId], // Substitui pelo ID real
  }));

  // Inserir os follows no banco
  await prisma.follower.createMany({ data: followsWithIds });
  console.log("Follows inseridos com sucesso.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
// Comando para inserção: npx ts-node src/mocks/users.ts
