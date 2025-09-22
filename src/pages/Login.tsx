import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      // Navigation is handled in the AuthContext
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile/Tablet Top Design */}
      <div className="block lg:hidden relative w-full h-44 mb-2">
        {/* Green and black overlapping circles for mobile/tablet */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '-80px',
          width: '220px',
          height: '220px',
          background: '#4ee3b0',
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50px',
          width: '240px',
          height: '140px',
          background: '#23292f',
          borderBottomLeftRadius: '140px',
          borderBottomRightRadius: '140px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src="/gucwhite.png"
            alt="GoUnicrew"
            style={{
              height: '54px',
              width: 'auto',
              marginTop: '18px',
              objectFit: 'contain',
              maxWidth: '80%'
            }}
          />
        </div>
      </div>
      {/* Left Side - Brand Section for desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#7be7b7] to-[#d6f9e7] relative overflow-hidden">
        {/* Small diagonal black block at top left with centered logo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '280px',
          height: '130px',
          background: '#23292f',
          clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2
        }}>
          <img
            src="/gucwhite.png"
            alt="GoUnicrew"
            style={{
              height: '48px',
              width: 'auto',
              filter: 'none',
              boxShadow: 'none',
              margin: 0,
              objectFit: 'contain',
              maxWidth: '70%'
            }}
          />
        </div>
        {/* Content below logo block */}
        <div className="relative z-10 flex flex-col items-start" style={{marginTop: '170px', marginLeft: '40px'}}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 600,
            color: '#23292f',
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>HR Management Platform</h1>
          <div style={{
            width: '120px',
            height: '8px',
            background: '#23292f',
            borderRadius: '6px',
            marginBottom: '18px'
          }} />
          <p style={{
            fontSize: '1.15rem',
            color: '#23292f',
            fontWeight: 400,
            maxWidth: '340px',
            lineHeight: 1.4
          }}>
            Manage all employees, payrolls, and other human resource operations.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Welcome to GoUnicrew</h2>
            <p className="text-gray-600 text-sm sm:text-base">Sign in to your account to continue</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                <div className="space-y-2 sm:space-y-3">
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
                      className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
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
                      className="pl-10 pr-10 h-10 sm:h-12 border-gray-200 focus:border-primary focus:ring-primary"
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
                  className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                  Login
                </Button>

                {/* Sign Up button removed as requested */}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;