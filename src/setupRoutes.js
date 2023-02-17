const contractsRoutes = require('./routes/contracts.routes')
const jobsRoutes = require('./routes/jobs.routes')
const balancesRoutes = require('./routes/balances.routes')
const adminRoutes = require('./routes/admin.routes')

const setupRoutes = (app) => {
    contractsRoutes.setupContextRoutes(app);
    jobsRoutes.setupContextRoutes(app);
    balancesRoutes.setupContextRoutes(app);
    adminRoutes.setupContextRoutes(app);
}

module.exports = { setupRoutes }