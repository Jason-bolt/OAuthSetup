import { Request, Response } from "express";

interface IBaseController {
  something(req: Request, res: Response): Promise<object>;
}

export default IBaseController;
