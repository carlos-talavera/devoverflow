"use server"

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";

const SearchableTypes = ["question", "user", "answer", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    connectToDatabase();

    // Everything everywhere all at once -> The global search!
    const { query, type } = params
    const regexQuery = { $regex: query, $options: "i" }

    let results = []

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ]

    if (!type || !SearchableTypes.includes(type)) {
      // Search across everything
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2)

        results.push(...queryResults.map((item) => ({
          title: type === "answer" ? `Answers containing ${query}` : item[searchField],
          type,
          id: type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id
        })))
      }
    } else {
      // Search only in the specified model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type)

      if (!modelInfo) {
        throw new Error(`Invalid search type: ${type}`)
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery
        })
        .limit(8)

      results = queryResults.map((item) => ({
        title: type === "answer" ? `Answers containing ${query}` : item[modelInfo.searchField],
        type,
        id: type === "user"
          ? item.clerkId
          : type === "answer"
            ? item.question
            : item._id
      }))

    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(`Error fetching global results: ${error}`);
    throw error;
  }
}