import {
  SignInButton,
  SignedOut
} from "@clerk/nextjs";

const Home = () => {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
};

export default Home;
