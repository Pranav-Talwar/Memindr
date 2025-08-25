import  { useRef } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { useNavigate } from "react-router-dom";
function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
const navigate = useNavigate();
  async function handleSignup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

 await axios.post(backendUrl + "/api/v1/signup",{ username, password }
    ).then(() => {
        alert("Signup successful");
        navigate("/signin");
        }   
    ).catch(() => {
        alert("Signup failed");
    }
    );

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
        <button onClick={handleSignup} className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Signup;
