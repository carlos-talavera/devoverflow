import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: 1,
    title: "Cascading Deletes in Django like a pro? Give me the best practices!",
    tags: [
      {
        _id: 1,
        name: "django",
      },
      {
        _id: 2,
        name: "python",
      },
    ],
    author: {
      _id: 1,
      name: "John Doe",
      picture:
        "https://randomuser.me/api/portraits/men/1.jpg",
    },
    upvotes: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 1000),
    answers: Array.from(
      { length: Math.floor(Math.random() * 10) },
      (_, index) => ({
        _id: index,
        content: "Sample answer content",
        author: {
          _id: Math.floor(Math.random() * 100),
          name: "Random User",
          picture:
            "https://randomuser.me/api/portraits/men/2.jpg",
        },
        createdAt: new Date().toISOString(),
      })
    ),
    createdAt: new Date(
      "2021-09-01T00:00:00.000Z"
    ),
  },
  {
    _id: 2,
    title: "How to center a div?",
    tags: [
      {
        _id: 3,
        name: "css",
      },
      {
        _id: 4,
        name: "html",
      },
    ],
    author: {
      _id: 2,
      name: "Jane Doe",
      picture:
        "https://randomuser.me/api/portraits/women/2.jpg",
    },
    upvotes: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 1000),
    answers: Array.from(
      { length: Math.floor(Math.random() * 10) },
      (_, index) => ({
        _id: index,
        content: "Sample answer content",
        author: {
          _id: Math.floor(Math.random() * 100),
          name: "Random User",
          picture:
            "https://randomuser.me/api/portraits/women/3.jpg",
        },
        createdAt: new Date().toISOString(),
      })
    ),
    createdAt: new Date(
      "2021-09-10T00:00:00.000Z"
    ),
  },
];

const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          All Questions
        </h1>

        <Link
          href="/ask-question"
          className="flex justify-end max-sm:w-full"
        >
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? 
          questions.map((question) => 
          (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          )
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
