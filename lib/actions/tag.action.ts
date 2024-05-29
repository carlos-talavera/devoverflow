"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Find interactions for the user and group by tags
    // Interaction...


    return [
      {
        _id: 1,
        name: "React"
      },
      {
        _id: 2,
        name: "Node.js"
      },
      {
        _id: 3,
        name: "Next.js"
      }
    ]
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    // Calculate the number of posts to skip based on the page
    // number and page size
    const skipAmount = (page - 1) * pageSize;

    const query : FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } }
      ]
    }

    let sortOptions = {}

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)
    ;

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return {
      tags,
      isNext
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, searchQuery , page = 1, pageSize = 20 } = params;

    // Calculate the number of posts to skip based on the page
    // number and page size
    const skipAmount = (page - 1) * pageSize;

    const query : FilterQuery<typeof Tag> = {}

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } }
      ]
    }

    const tagFilter: FilterQuery<typeof Tag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter)
      .populate({
        path: "questions",
        model: Question,
        match: query,
        options: {
          sort: { createdAt: -1 },
          skip: skipAmount,
          limit: pageSize + 1
        },
        populate: [
          {
            path: "tags",
            model: Tag,
            select: "_id name",
          },
          {
            path: "author",
            model: User,
            select: "_id clerkId name picture",
          },
        ],
      }
    );

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    const isNext = questions.length > pageSize;

    return {
      tagTitle: tag.name,
      questions,
      isNext
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { 
        $project: {
          name: 1,
          totalQuestions: { $size: "$questions" }
        }
      },
      {
        $sort: {
          totalQuestions: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}