import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register: RequestHandler = async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(400).json({ message: "User already exists" });
    }

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
      expiresIn: "15d",
    });
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const formattedId = id.replace(/"/g, "");
  try {
    const user = await prisma.user.findUnique({
      where: { id: formattedId },
    });
    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving user",
    });
  }
};
export const getUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving user",
    });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const token = authHeader.split(" ")[1]; // Assuming the token is in the format "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // await prisma.user.delete({
    //   where: {
    //     id: decoded.userId,
    //   },
    // });

    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      data: null,
      error: {
        name: "application_error",
        message: "Unable to fetch data. The request could not be resolved.",
      },
    });
  }
};

export const updateRole: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const formattedId = id.replace(/"/g, "");
    await prisma.user.update({
      where: {
        id: formattedId,
      },
      data: {
        role,
      },
    });
    res.status(200).json({
      message: "Role updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating role",
    });
  }
};
