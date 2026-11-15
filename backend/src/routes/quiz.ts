import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { requireRole } from "../auth";

// Trainer/trainee quiz: trainer activates questions, trainee answers them
// (a correct answer deactivates the question again)

const router = Router();

router.get("/questions", async (req: Request, res: Response) => {
  const questions = await prisma.questions.findMany();
  res.json(questions);
});

router.get("/answers", async (req: Request, res: Response) => {
  const answers = await prisma.answers.findMany();
  res.json(answers);
});

// Only trainers may activate questions, enforced here, not only by hiding the button
router.put("/activateQuestions", requireRole("trainer"), async (req: Request, res: Response) => {
  const { ids } = req.body;

  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "No question IDs provided" });
      return;
    }

    await prisma.questions.updateMany({
      where: { ID: { in: ids.map((id: unknown) => Number(id)) } },
      data: { IsActive: true },
    });

    res.json({ message: "Questions activated successfully" });
  } catch (error) {
    console.error("Activate questions error:", error);
    res.status(500).json({ error: "Failed to activate questions" });
  }
});

router.put("/deactivateQuestions", async (req: Request, res: Response) => {
  const { ids } = req.body;

  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "No question IDs provided" });
      return;
    }

    await prisma.questions.updateMany({
      where: { ID: { in: ids.map((id: unknown) => Number(id)) } },
      data: { IsActive: false },
    });

    res.json({ message: "Questions deactivated successfully" });
  } catch (error) {
    console.error("Deactivate questions error:", error);
    res.status(500).json({ error: "Failed to deactivate questions" });
  }
});

export default router;
