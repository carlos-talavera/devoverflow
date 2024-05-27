"use server"

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question
    })

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(
      question,
      { $push: { answers: newAnswer._id } }
    )

    // TODO: Add interaction...

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const questionIdObj = new ObjectId(questionId);

    const answers = await Answer.find({ question: questionIdObj })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 })
    ;

    return {
      answers
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(
  params: AnswerVoteParams
) {
  try {
    connectToDatabase();

    const {
      answerId,
      userId,
      hasUpvoted,
      hasDownvoted,
      path,
    } = params;

    let updateQuery = {};

    if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const answer =
      await Answer.findByIdAndUpdate(
        answerId,
        updateQuery,
        { new: true }
      );

    if (!answer) {
      throw new Error("Answer not found");
    }

    // TODO: increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(
  params: AnswerVoteParams
) {
  try {
    connectToDatabase();

    const {
      answerId,
      userId,
      hasUpvoted,
      hasDownvoted,
      path,
    } = params;

    let updateQuery = {};

    if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const answer =
      await Answer.findByIdAndUpdate(
        answerId,
        updateQuery,
        { new: true }
      );

    if (!answer) {
      throw new Error("Answer not found");
    }

    // TODO: increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(
  params: DeleteAnswerParams
) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await Answer.deleteOne({
      _id: answerId,
    });

    await Question.updateOne(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}