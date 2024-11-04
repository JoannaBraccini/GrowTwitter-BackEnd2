import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  //CREATE -> movido para authController: signup

  //READ (many by query)
  public static async findMany(req: Request, res: Response): Promise<void> {
    try {
      //recebe o query
      const { name, username, email } = req.query;

      //chama o service
      const service = new UserService();
      const result = await service.findMany({
        name: name as string,
        username: username as string,
        email: email as string,
      });

      //responder o cliente
      const { code, ...response } = result;
      res.status(code).json(response);
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: `Error fetching users: ${error.message}`,
      });
    }
  }

  //READ (one by id)
  public static async findOne(req: Request, res: Response): Promise<void> {
    try {
      //recebe o id nos params
      const { id } = req.params;
      //chama o service
      const service = new UserService();
      //aguarda a resposta da busca
      const result = await service.findOne(id);
      //desestrutura a resposta
      const { code, ...response } = result;
      //retorna para o cliente
      res.status(code).json(response);
    } catch (error: any) {
      res.status(500).json({
        ok: false,
        message: `Error fetching user: ${error.message}`,
      });
    }
  }
}