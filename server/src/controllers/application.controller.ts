import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_KEY!);

export const getApplications: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const formattedId = id.replace(/"/g, "");
  try {
    const applications = await prisma.application.findMany({
      where: {
        Job: {
          User: {
            id: formattedId,
          },
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

export const deleteApplication: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await prisma.application.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      message: "Application deleted successfully",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting application",
    });
  }
};

export const scheduleInterview: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const senderMail = await prisma.application.findUnique({
      where: { id },
      select: {
        User: {
          select: {
            email: true,
          },
        },
      },
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "prajwalpl096@gmail.com",
        pass: process.env.APP_PASSWORD!,
      },
    });

    const mailOptions = {
      from: "prajwalpl096@gmail.com",
      to: senderMail?.User.email,
      subject: "Interview Scheduled",
      html: "<p>Interview Scheduled</p>",
    };

    const sendMail = async (transporter: any, mailOptions: any) => {
      try {
        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully");
      } catch (error) {
        console.log(error);
      }
    };

    await sendMail(transporter, mailOptions);

    res.status(200).json({
      message: "Interview scheduled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error scheduling interview",
    });
  }
};
