import supertest from "supertest";
import { createServer } from "../../../src/express.server";
import { makeToken } from "../make-token";
import { TweetType } from "@prisma/client";
import { CreateTweetDto } from "../../../src/dtos";
import { TweetService } from "../../../src/services/tweet.service";
import { randomUUID } from "crypto";

const server = createServer();
const endpoint = "/tweets";

describe("POST /tweets", () => {
  //Auth
  it("Deve retornar 401 quando token não for informado", async () => {
    const response = await supertest(server).post(endpoint);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Unauthorized: Token is required",
    });
  });

  it("Deve retornar 401 quando for informado token de formato inválido", async () => {
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", "invalid_token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Unauthorized: Invalid or missing token",
    });
  });

  it("Deve retornar 401 quando for informado token inválido ou expirado", async () => {
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", "Bearer invalidToken");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      message: "Unauthorized: Invalid or expired token",
    });
  });

  //Required
  it("Deve retornar 400 quando Tipo do tweet não for informado", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ type: null, parentId: null, content: "Texto" });

    expect(response.statusCode).toBe(400);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: ["Tweet type is required"],
    });
  });

  it("Deve retornar 400 quando parentId não for informado para Retweet/Reply", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ type: TweetType.REPLY, parentId: null, content: "Texto" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: ["Parent Tweet ID is required for REPLY or RETWEET"],
    });
  });

  it("Deve retornar 400 quando parentId for inválido", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ type: TweetType.TWEET, parentId: "id-tweet", content: "Texto" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: ["Parent Tweed ID is only valid for RETWEET or REPLY"],
    });
  });

  it("Deve retornar 400 quando parentId for informado para Tweet", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: TweetType.TWEET,
        parentId: "3f1c0a4e-8d5b-4e2b-a4d1-2f3f9b6c8a7e",
        content: "Texto",
      });

    expect(response.statusCode).toBe(400);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: ["Parent Tweed ID is only valid for RETWEET or REPLY"],
    });
  });

  it("Deve retornar 400 quando Conteúdo do tweet não for informado", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ type: TweetType.TWEET, parentId: null, content: "" });

    expect(response.statusCode).toBe(400);
    expect(response).toHaveProperty("body", {
      ok: false,
      message: ["Content is required"],
    });
  });
  //Types
  it("Deve retornar 400 quando Tipo for inválido", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "Tipo", parentId: null, content: "Texto" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: ["Type must be TWEET, REPLY or RETWEET"],
    });
  });

  it("Deve retornar 400 quando tipo do Content for inválido", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({ type: TweetType.TWEET, parentId: null, content: 1234 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: ["Content must be a string"],
    });
  });
  //Length
  it("Deve retornar 400 quando Content for maior que o limite permitido", async () => {
    const token = makeToken();
    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: TweetType.TWEET,
        parentId: null,
        content:
          "Este é um tweet de teste para verificar a validação de limite de caracteres no sistema. O Twitter permite até 280 caracteres, então este texto precisa ser mais longo para ultrapassar esse limite. Vamos adicionar mais algumas palavras para garantir que o total exceda a quantidade permitida. Continuando a digitar até que o texto fique realmente grande e ultrapasse o limite máximo definido na aplicação. Dessa forma, poderemos testar se a lógica de validação está funcionando corretamente e se o sistema retorna um erro adequado ao detectar que o tamanho do texto ultrapassou 280 caracteres",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      message: "Content exceeds the maximum allowed length of 280 characters",
    });
  });
  //Controller
  it("Deve retornar 500 quando ocorrer erro de exceção", async () => {
    const token = makeToken();
    // Simulando um erro no controller
    jest.spyOn(TweetService.prototype, "create").mockImplementationOnce(() => {
      throw new Error("Exception");
    });

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: TweetType.TWEET,
        parentId: null,
        content: "Texto do Tweet",
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      ok: false,
      message: "An unexpected error occurred: Exception",
    });
  });
  //Service
  it("Deve retornar 201 quando Tweet for cadastrado no sistema", async () => {
    const token = makeToken();
    const body: CreateTweetDto = {
      userId: randomUUID(),
      parentId: undefined,
      type: TweetType.TWEET,
      content: "Um texto para o Tweet",
    };
    const mockAuth = {
      ok: true,
      code: 201,
      message: "Tweet created successfully",
      data: { ...body, id: randomUUID(), createdAt: new Date().toISOString() },
    };
    jest
      .spyOn(TweetService.prototype, "create")
      .mockResolvedValueOnce(mockAuth);

    const response = await supertest(server)
      .post(endpoint)
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      ok: true,
      message: "Tweet created successfully",
      data: expect.objectContaining({
        id: mockAuth.data.id,
        // parentId: mockAuth.data.parentId,->Só vem se for REPLY/RETWEET
        type: mockAuth.data.type,
        content: mockAuth.data.content,
        userId: mockAuth.data.userId,
        createdAt: mockAuth.data.createdAt,
      }),
    });
  });
});
