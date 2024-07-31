import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";

const prisma = new PrismaClient();

export const getJobs: RequestHandler = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();
    res.status(200).json({
      message: "Jobs retrieved successfully",
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving jobs",
    });
  }
};

export const getJobById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.findUnique({ where: { id } });
    res.status(200).json({
      message: "Job retrieved successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving job",
    });
  }
};

export const addJob: RequestHandler = async (req, res) => {
  const { title, description, userId, location, salary } = req.body;
  try {
    await prisma.job.create({
      data: {
        title,
        description,
        location,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.status(201).json({
      message: "Job added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error adding job",
    });
  }
};

export const updateJob: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        title,
        description,
      },
    });
    res.status(200).json({
      message: "Job updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating job",
    });
  }
};

export const deleteJob: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.job.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting job",
    });
  }
};
