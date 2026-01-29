import UserMongoRepository from "./infrastructure/database/repository/user.mongo.js";

// Use cases
import createUser from "./application/useCases/createUser.js";
import getUserById from "./application/useCases/getUserById.js";
import updateUser from "./application/useCases/updateUser.js";
import deleteUser from "./application/useCases/deleteUser.js";
import getUsers from "./application/useCases/getUsers.js";
import loginUser from "./application/useCases/loginUser.js";
import changePassword from "./application/useCases/changePassword.js";
import forgotPassword from "./application/useCases/forgotPassword.js";
import resetPassword from "./application/useCases/resetPassword.js";
import refreshToken from "./application/useCases/refreshToken.js";
import logoutUser from "./application/useCases/logoutUser.js";

import authController from "./interfaces/controllers/user.controller.js";
import authRoutes from "./interfaces/routes/user.routes.js";

const initializeAuthModule = () => {
    console.log("Authentication module initialized.");

    const userRepo = new UserMongoRepository();

    const useCases = {
        // User CRUD
        create: createUser(userRepo),
        getById: getUserById(userRepo),
        update: updateUser(userRepo),
        delete: deleteUser(userRepo),
        getAll: getUsers(userRepo),
        
        // Auth operations
        login: loginUser(userRepo),
        logout: logoutUser(userRepo),
        changePassword: changePassword(userRepo),
        forgotPassword: forgotPassword(userRepo),
        resetPassword: resetPassword(userRepo),
        refreshToken: refreshToken(userRepo)
    };

    const controller = authController(useCases);
    const routes = authRoutes(controller);

    return {
        routes,
        controller,
        useCases
    };
};

export default initializeAuthModule;
