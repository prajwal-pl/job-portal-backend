import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getJobs: RequestHandler = async (req, res) => {
  try {
    await prisma.job.findMany();
    res.status(200).json({
      message: "Jobs retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving jobs",
    });
  }
};

export const register: RequestHandler = async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const addJob: RequestHandler = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.body.userId;
  try {
    await prisma.job.create({
      data: {
        title,
        description,
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
