const JobService = require('../services/job.service');
const HttpResponse = require('../classes/HttpResponse');

class JobController {

    static async getUnpaidJobs(profileId) {
        try {
            return new JobService().getUnpaidJobs(profileId);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error');
        }
    }

    static async performJobPayment(profileId, jobId) {
        try {
            return new JobService().performJobPayment(profileId, jobId);
        } catch (error) {
            return new HttpResponse(500, 'Internal Server Error');
        }
    }
}

module.exports = JobController;
