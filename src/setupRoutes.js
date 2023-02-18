const contractsRoutes = require('./routes/contract.routes')
const jobsRoutes = require('./routes/job.routes')
const balancesRoutes = require('./routes/balance.routes')
const adminRoutes = require('./routes/admin.routes')

const setupRoutes = (app) => {
    contractsRoutes.setupContextRoutes(app);
    jobsRoutes.setupContextRoutes(app);
    balancesRoutes.setupContextRoutes(app);
    adminRoutes.setupContextRoutes(app);
}

module.exports = { setupRoutes }