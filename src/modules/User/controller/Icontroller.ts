import { Request, Response } from "express";

interface IUserController {
  getUserById(req: Request, res: Response): Promise<object>;
  getUserByEmail(req: Request, res: Response): Promise<object>;
}

export default IUserController;
