import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,fetchSignInMethodsForEmail } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User } from 'lucide-react';
import logo from '@/assets/consumption.png';
import { log } from 'console';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate email format first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      toast({
        title: '❌ Invalid Email Format',
        description: 'Please enter a valid email address (e.g., user@example.com)',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Check if password is empty
    if (!loginPassword || loginPassword.trim() === '') {
      toast({
        title: '❌ Password Required',
        description: 'Please enter your password',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
       const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
       const methods = await signInWithEmailAndPassword(auth, loginEmail,loginPassword);
       const user = userCredential.user;
       const token = await user.getIdToken();
       localStorage.setItem('authToken', token);
       console.log('sign-in methods for', loginEmail, methods);
      
      toast({
        title: '✨ Welcome back!',
        description: "Let's find your perfect style today.",
      });
      
      navigate('/style-chat');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorTitle = 'Login Failed';
      let errorMessage = 'Please try again.';
      
      // Handle all Firebase auth errors
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        errorTitle = '❌ Invalid Credentials';
        errorMessage = 'The email or password you entered is incorrect. Please try again or click "Forgot Password" to reset it.';
        break;
      case 'auth/invalid-email':
        errorTitle = '❌ Invalid Email';
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/user-disabled':
        errorTitle = '❌ Account Disabled';
        errorMessage = 'This account has been disabled. Please contact support for assistance.';
        break;
      case 'auth/too-many-requests':
        errorTitle = '⚠️ Too Many Login Attempts';
        errorMessage = 'Access temporarily blocked due to too many failed attempts. Please try again in a few minutes or reset your password.';
        break;
      case 'auth/network-request-failed':
        errorTitle = '🌐 Network Error';
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        break;
      case 'auth/operation-not-allowed':
        errorTitle = '⚠️ Service Unavailable';
        errorMessage = 'Email/password sign-in is currently disabled. Please contact support.';
        break;
      default:
        errorTitle = '❌ Login Error';
        errorMessage = error.message || 'An unexpected error occurred. Please try again.';
    }
    
    toast({
      title: errorTitle,
      description: errorMessage,
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Signup started with:', { signupName, signupEmail });

    if (signupPassword !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    if (signupPassword.length < 6) {
      toast({
        title: '❌ Weak Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Creating Firebase user...');
      
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;
      
      console.log('User created successfully, UID:', user.uid);

      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', signupName);
      
      console.log('Token saved');
      
      setIsLoading(false);
      
      toast({
        title: '🎉 Account created!',
        description: 'Your style journey begins now.',
      });
      
      console.log('Navigating to style-chat...');
      navigate('/style-chat');
      
    } catch (error: any) {
      console.error('Full signup error:', error);
      
      let errorTitle = 'Signup Failed';
      let errorMessage = 'Could not create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorTitle = '❌ Email Already Registered';
        errorMessage = 'This email is already in use. Please login or use a different email.';
      } else if (error.code === 'auth/weak-password') {
        errorTitle = '❌ Weak Password';
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        errorTitle = '❌ Invalid Email';
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorTitle = '⚠️ Service Unavailable';
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorTitle = '🌐 Network Error';
        errorMessage = 'Unable to connect. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    }finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setIsResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      
      toast({
        title: '✉️ Email sent!',
        description: 'Check your inbox for password reset instructions.',
      });
      
      setResetDialogOpen(false);
      setResetEmail('');
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let errorTitle = 'Reset Failed';
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorTitle = '❌ Account Not Found';
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorTitle = '❌ Invalid Email';
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorTitle = '⚠️ Too Many Attempts';
        errorMessage = 'Too many reset attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={logo} 
              alt="Style Mate Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Style Mate
          </h1>
          <p className="text-muted-foreground mt-2">Your AI Fashion Companion</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-sm md:text-base">Login</TabsTrigger>
            <TabsTrigger value="signup" className="text-sm md:text-base">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="animate-fade-in">
            <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription className="text-base">
                  Sign in to continue your style journey
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-11"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  
                  {/* Forgot Password Dialog */}
                  <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="link" className="text-sm text-purple-600 hover:text-purple-700">
                        Forgot your password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <form onSubmit={handlePasswordReset}>
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                          <DialogDescription>
                            Enter your email address and we'll send you a link to reset your password.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email" className="text-sm font-medium">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                              <Input
                                id="reset-email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10 h-11"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setResetDialogOpen(false);
                              setResetEmail('');
                            }}
                            disabled={isResetLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            disabled={isResetLoading}
                          >
                            {isResetLoading ? (
                              <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                              </span>
                            ) : (
                              'Send Reset Link'
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="animate-fade-in">
            <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                <CardDescription className="text-base">
                  Join us and discover your perfect style
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 h-11"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-11"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-purple-600 hover:text-purple-700 underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-purple-600 hover:text-purple-700 underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}