import { Request, RequestHandler, Response, NextFunction } from 'express';
import { UserDocument } from '../models/User';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      file?: any;
    }
  }
}

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export type TypedRequestBody<T> = Request<ParamsDictionary, any, T, ParsedQs>;
export type TypedResponse<T> = Response<T>;

export type AuthRequestHandler<T = any> = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export {}; 