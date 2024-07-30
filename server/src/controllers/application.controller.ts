import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_KEY!);

export const getApplications: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const formattedId = id.replace(/"/g, "");
  try {
    const applications = await prisma.application.findMany({
      where: {
        User: {
          id: formattedId,
        },
      },
    });
    if (applications.length === 0) {
      return res.status(404).json({
        message: "No applications found",
      });
    }
    res.status(200).json({
      message: "Application retrieved successfully",
      applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving application",
    });
  }
};

export const getApplicationById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await prisma.application.findUnique({ where: { id } });
    res.status(200).json({
      message: "Application retrieved successfully",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving application",
    });
  }
};

export const addApplication: RequestHandler = async (req, res) => {
  const { jobId } = req.params;
  const { userId, resume, CV } = req.body;
  try {
    // const existingApplication = await prisma.application.findFirst({
    //   where: {
    //     Job: {
    //       id: jobId,
    //     },
    //     User: {
    //       id: userId,
    //     },
    //   },
    // });

    // if (existingApplication) {
    //   res.status(400).json({
    //     message: "Application already exists",
    //   });
    // }
    const application = await prisma.application.create({
      data: {
        Job: {
          connect: {
            id: jobId,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
        resume,
        CV,
      },
    });

    const applicationEmail = await prisma.application.findUnique({
      where: {
        id: application.id,
      },
      select: {
        User: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(applicationEmail?.User.email);

    // // if (application) {
    // //   const { data, error } = await resend.emails.send({
    // //     from: applicationEmail?.User.email as string,
    // //     to: "prajwalpl096@gmail.com",
    // //     subject: "Application Recieved",
    // //     html: `<p>A job application request recieved from<strong>${applicationEmail?.User.email}</strong>!</p>`,
    // //     text: `Hi, A job application request recieved from ${applicationEmail?.User.name}! Make sure to check the application details.`,
    // //   });

    // //   if (error) {
    // //     console.log(error);
    // //   }
    //   console.log(data);
    // }

    res.status(201).json({
      message: "Application added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding application" });
  }
};
