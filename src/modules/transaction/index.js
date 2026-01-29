import TransactionMongoRepository from "./infrastructure/database/repository/transaction.mongo.js";

// Use cases
import createTransaction from "./application/useCases/createTransaction.js";
import getTransactionById from "./application/useCases/getTransactionById.js";
import getTransactions from "./application/useCases/getTransactions.js";
import updateTransaction from "./application/useCases/updateTransaction.js";
import deleteTransaction from "./application/useCases/deleteTransaction.js";
import getDashboardStats from "./application/useCases/getDashboardStats.js";

import transactionController from "./interfaces/controllers/transaction.controller.js";
import transactionRoutes from "./interfaces/routes/transaction.routes.js";
import dashboardRoutes from "./interfaces/routes/dashboard.routes.js";

const initializeTransactionModule = () => {
    console.log("Transaction module initialized.");

    const transactionRepo = new TransactionMongoRepository();

    const useCases = {
        // Transaction CRUD
        create: createTransaction(transactionRepo),
        getById: getTransactionById(transactionRepo),
        getAll: getTransactions(transactionRepo),
        update: updateTransaction(transactionRepo),
        delete: deleteTransaction(transactionRepo),
        getDashboardStats: getDashboardStats(transactionRepo)
    };

    const controller = transactionController(useCases);
    const routes = transactionRoutes(controller);
    const dashboard = dashboardRoutes(controller);

    return {
        routes,
        dashboardRoutes: dashboard,
        controller,
        useCases
    };
};

export default initializeTransactionModule;
