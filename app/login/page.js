import { signIn } from "@/auth";
import Image from "next/image";

const Login = () => {
  return (
    <>
      <form
        className="mx-auto items-center justify-center h-screen w-full flex"
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/api/chat/new" });
        }}
      >
        <button
          className="bg-white hover:bg-gray-50 text-black text-xl font-light py-2 px-8 rounded flex gap-4"
          type="submit"
        >
         <Image src="/google.png" alt="Google Icon" width={30} height={30} className="bg-white" />
          Signin with Google
        </button>
      </form>
    </>
  );
};

export default Login;
