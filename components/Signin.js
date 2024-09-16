import React, {useContext} from "react";
import { authContext } from "@/lib/store/auth-contex";
import { FcGoogle }  from "react-icons/fc";


function SignIn() {
    const { googleLoginHandler } =  useContext(authContext);


    return (
        <main className="container max-w-2xl px-6 mx-auto">
            <h1 className="mb-6 text-5xl font-bold text-center text-gray-900 animate-pulse">
                Welcome 🙏
            </h1>
            <div className=" flex flex-col relative h-52 overflow-hidden shadow-md rounded-2xl">
            <img
                className="object-cover w-full h-full transition-transform transform hover:scale-105"
                src="https://th.bing.com/th/id/R.606935230b93b00149906279da906c89?rik=J60gYp0UR3uHZg&pid=ImgRaw&r=0"
                alt="Track-Dollar"
            />
            </div>
            <div className="px-4 py-4"> 
                <h3 className="mb-3 text-2xl text-center text-gray-900 ">Please sign in to continue</h3>
                <button onClick={ googleLoginHandler } className="flex items-center gap-2 p-4 mx-auto mt-6 bg-slate-900 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
                    <FcGoogle className="text-2xl" />
                    Google
                </button>

            </div>
        </main>
    );
}

export default  SignIn;
