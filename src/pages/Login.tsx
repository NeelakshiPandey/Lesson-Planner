import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Dummy Credentials
  const validEmail: string = "demouser";
  const validPassword: string = "demopass";

  const handleLogin = (): void => {
    if (email === validEmail && password === validPassword) {
      navigate("/lesson-planner");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className={`flex h-screen items-center justify-center transition-colors ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Card className={`p-6 w-96 text-center ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Login</h2>

        
          <div className="flex items-center gap-2">
            <span>Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </div>

        <Input 
          type="text" 
          placeholder="Email" 
          value={email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
          className="mb-2"
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
          className="mb-4"
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button onClick={handleLogin} className="w-full">Login</Button>
      </Card>
    </div>
  );
}
