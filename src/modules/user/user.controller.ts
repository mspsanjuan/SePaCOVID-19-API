import * as express from 'express';
import Controller from '../../interfaces/controller.interface';

class UserController implements Controller {
    public path = '/users';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
    }

    // private getAllPostsOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    //     const userId = request.params.id;
    //     if (userId === request.user.id.toString()) {
    //         const posts = await this.post.find({ author: userId });
    //         response.send(posts);
    //     }
    //     next(new NotAuthorizedException());
    // }
}

export default UserController;
