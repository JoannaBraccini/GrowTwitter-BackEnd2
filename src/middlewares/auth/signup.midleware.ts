import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database/prisma.database";

export class SignupMiddleware {
  public static validateRequired(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, email, password, username } = req.body;
    const errors: string[] = []; //cria um array para armazenar os erros e exibir todos juntos no final

    if (!name) {
      errors.push("Name is required!"); //joga o erro no array
    }
    if (!email) {
      errors.push("Email is required!");
    }
    if (!password) {
      errors.push("Password is required!");
    }
    if (!username) {
      errors.push("Username is required!");
    }
    //valida todos os campos obrigatórios, se cair em algum erro exibe na resposta
    if (errors.length > 0) {
      res.status(400).json({
        ok: false,
        message: errors,
      });
    }

    return next();
  }

  public static validateTypes(req: Request, res: Response, next: NextFunction) {
    const { name, email, username, password } = req.body;

    //valida se os tipos são string
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        ok: false,
        message: "All fields must be strings.",
      });
    }

    return next();
  }

  public static validateLength(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, email, username, password } = req.body;
    const errors: string[] = [];

    if (name.length < 3) {
      errors.push("Name must be at least 3 characters long.");
    }

    // Regex para validar o email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email.");
    }

    if (username.length < 3) {
      errors.push("Username must be at least 3 characters long.");
    }

    if (password.length < 4) {
      errors.push("Password must be at least 4 characters long.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        ok: false,
        message: errors,
      });
    }

    return next();
  }

  public static async validateUnique(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { email, username } = req.body;
    //espera resolver todas as promises antes de responder, armazenando a resposta em cada const
    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (existingEmail) {
      return res.status(400).json({
        ok: false,
        message: "Email is already in use.",
      });
    }

    if (existingUsername) {
      return res.status(400).json({
        ok: false,
        message: "Username is already in use.",
      });
    }

    return next();
  }
}