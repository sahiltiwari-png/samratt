import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <div className="mb-8">
            <img 
              src="/src/assets/gounicrew-logo.png" 
              alt="GoUnicrew"
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
          </div>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">HR Management Platform</h1>
            <p className="text-lg leading-relaxed opacity-90">
              Manage all employees, payrolls, and other human resource operations.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-full"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GoUnicrew</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember Me
                    </Label>
                  </div>
                  <Button variant="link" className="text-sm text-primary hover:text-primary/80 p-0 h-auto">
                    Forgot Password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                  Login
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm text-gray-600 hover:text-gray-800">
                    Sign Up
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;