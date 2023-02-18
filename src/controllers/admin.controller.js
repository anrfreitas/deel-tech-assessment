const AdminService = require('../services/admin.service');
const HttpResponse = require('../classes/HttpResponse');

class AdminController {

    static async getBestProfessional(startDate, endDate) {
        try {
            return new AdminService().getBestProfessional(startDate, endDate);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error', error);
        }
    }

    static async getBestClients(startDate, endDate, limit) {
        try {
            return new AdminService().getBestClients(startDate, endDate, limit);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error', error);
        }
    }
}

module.exports = AdminController;
