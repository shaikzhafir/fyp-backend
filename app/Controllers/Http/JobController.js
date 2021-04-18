"use strict";

const Project = use("App/Models/Project");
const User = use("App/Models/User");
const Job = use("App/Models/Job");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with jobs
 */
class JobController {
  /**
   * Show a list of all jobs.
   * GET jobs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params, request, response, view }) {
    //return array of jobs depending on project
    const projectID = params.projectID;
    const project = await Project.find(projectID);
    const jobs = await project.jobs().fetch();

    response.json({
      message: "jobs query success",
      jobs: jobs,
    });
  }

  async jobByUserID({ params, response }) {
    const userID = params.userID;
    const user = await User.find(userID);
    console.log(user.toJSON());
    const jobs = await user.jobs().fetch();
    console.log(jobs);

    response.json({
      jobs: jobs,
    });
  }

  /**
   * Create/save a new job.
   * POST jobs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async storeAll({ request, response }) {
    //take in array of jobs
    //check if job exist in db
    //if exist, update
    //if no exist, create

    const objectArray = request.all();
    const jobArray = objectArray["jobs"];
    console.log(jobArray);

    jobArray.forEach(async (job) => {
      //if job exists in db, it will have an id
      if (job["id"]) {
        //update job
        const jobEdit = await Job.find(job.id);
        jobEdit.detail = job.detail;
        jobEdit.user_id = job.user_id;
        jobEdit.status = job.status;
        //jobEdit.hours_spent = job.hours_spent

        await jobEdit.save();
      } else {
        const newJob = new Job();
        newJob.detail = job.detail;
        newJob.user_id = job.user_id;
        newJob.project_id = job.project_id;
        newJob.status = job.status;
        //newJob.hours_spent = job.hours_spent
        await newJob.save();
        
      }
    });

    return response.json({
      message: "board updated",
    });
  }

  async storeOne({ request, response }) {
    const job = request.post();
    //if job exists in db, update, else create
    if (job["id"]) {
      const jobEdit = await Job.find(job.id);
      jobEdit.detail = job.detail;
      jobEdit.user_id = job.user_id;
      jobEdit.status = job.status;
      jobEdit.hours_spent = job.hours_spent;
      await jobEdit.save();
    
      return response.json({
        id : jobEdit.id
      });

    } else {
      const newJob = new Job();
      newJob.detail = job.detail;
      newJob.user_id = job.user_id;
      newJob.project_id = job.project_id;
      newJob.status = job.status;
      newJob.hours_spent = job.hours_spent;
      await newJob.save();
      return response.json({
      id : newJob.id
    });
    }

    
  }

  /**
   * Display a single job.
   * GET jobs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing job.
   * GET jobs/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {

  }

  /**
   * Update job details.
   * PUT or PATCH jobs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const jobID = params.jobID
    const body = request.post()
    console.log(body);
    const job = await Job.find(jobID)

    job.status = body.status
    await job.save()

    response.json({
      message : 'success'
    })

  }

  /**
   * Delete a job with id.
   * DELETE jobs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const jobID = params.jobID;
    const job = await Job.find(jobID);
    await job.delete();

    response.json({
      message: "job deleted",
    });
  }
}

module.exports = JobController;
