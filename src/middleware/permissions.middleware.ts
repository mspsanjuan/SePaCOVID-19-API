import { NextFunction, Response } from 'express';
import { newTrie } from 'shiro-trie';
import User from '../modules/user/user.model';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import HttpException from '../exceptions/HttpException';

function permissionsMiddleware(...permissions: string[]) {
    return async (request: RequestWithUser, response: Response, next: NextFunction) => {
        if (!permissions || !permissions.length) {
            next(new NotAuthorizedException());
            return;
        }

        try {
            const user = await User.findById(request.user.id);
            const userTrie = newTrie();
            userTrie.add(...user.permissions);
            for (const permission of permissions) {
                if (!userTrie.check(permission)) {
                    next(new NotAuthorizedException());
                    return;
                }
            }
            next();
        } catch (err) {
            next(new HttpException(400, err));
        }
    };
}

export default permissionsMiddleware;
