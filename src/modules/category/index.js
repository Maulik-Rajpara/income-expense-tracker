import CategoryMongoRepository from "./infrastructure/database/repository/category.mongo.js";

// Use cases
import createCategory from "./application/useCases/createCategory.js";
import getCategoryById from "./application/useCases/getCategoryById.js";
import getCategories from "./application/useCases/getCategories.js";
import getCategoriesByType from "./application/useCases/getCategoriesByType.js";
import updateCategory from "./application/useCases/updateCategory.js";
import deleteCategory from "./application/useCases/deleteCategory.js";

import categoryController from "./interfaces/controllers/category.controller.js";
import categoryRoutes from "./interfaces/routes/category.routes.js";

const initializeCategoryModule = () => {
    console.log("Category module initialized.");

    const categoryRepo = new CategoryMongoRepository();

    const useCases = {
        // Category CRUD
        create: createCategory(categoryRepo),
        getById: getCategoryById(categoryRepo),
        getAll: getCategories(categoryRepo),
        getByType: getCategoriesByType(categoryRepo),
        update: updateCategory(categoryRepo),
        delete: deleteCategory(categoryRepo)
    };

    const controller = categoryController(useCases);
    const routes = categoryRoutes(controller);

    return {
        routes,
        controller,
        useCases
    };
};

export default initializeCategoryModule;
