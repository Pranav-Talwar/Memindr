import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
  async function handleSignin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const res = await axios.post("http://localhost:3000/api/v1/signin", {
      username,
      password,
    });

    const jwt = res.data.token;
    localStorage.setItem("token", jwt);
   navigate("/home");
  }
  return (
    <div className=" h-screen w-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg  max-w-md">
        <input
          type="text"
          placeholder=" username"
          ref={usernameRef}
          className="mt-4 w-full rounded-md border border-white/10  text-white "
          autoComplete="username"
        />
        <br />
        <input
          type="password"
          placeholder=" password"
          ref={passwordRef}
          className="mt-4 w-full rounded-md border border-white/10   text-white"
          autoComplete="new-password"
        />
        <button
          onClick={handleSignin}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Signin;
