const AdminController = require('./admin.controller');
const BalanceController = require('./balance.controller');
const ContractController = require('./contract.controller');
const JobController = require('./job.controller');

module.exports = {
    adminController: AdminController,
    balanceController: BalanceController,
    contractController: ContractController,
    jobController: JobController,
};
