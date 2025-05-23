
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePrivy } from '@privy-io/react-auth';
import { useToast } from '@/hooks/use-toast';

export const useLoginForm = () => {
  const { signIn, isLoading: authLoading, user } = useAuth();
  const { login: privyLogin, ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('seller');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigateBasedOnRole(user.role, activeTab);
    }
  }, [user]);

  // Helper function for navigation based on role
  const navigateBasedOnRole = (userRole: string | null, selectedTab: string) => {
    // Always prioritize the selected tab for navigation
    if (selectedTab === 'seller') {
      console.log("Navigating to seller dashboard based on selected tab");
      navigate('/seller/dashboard');
    } else {
      console.log("Navigating to home based on selected tab");
      navigate('/');
    }
  };

  // Check Privy auth status for redirection
  useEffect(() => {
    if (privyReady && privyAuthenticated) {
      console.log("Privy authenticated, checking user details");
      // The PrivyAuthProvider will handle loading the user data
    }
  }, [privyReady, privyAuthenticated]);

  const handleEmailSignIn = async () => {
    try {
      setIsLoading(true);
      console.log(`Initiating Privy email login as ${activeTab}`);
      
      // Store the selected role in local storage to use after auth
      localStorage.setItem('preferred_role', activeTab);
      localStorage.setItem('selected_tab_role', activeTab);
      
      await privyLogin();
      
      toast({
        title: "Login initiated",
        description: "Please complete the login process in the popup.",
      });
    } catch (error) {
      console.error("Email login error:", error);
      toast({
        title: "Login failed",
        description: "Failed to start login process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Login failed",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log(`Logging in with email and password as ${activeTab}`);
      
      // Save the selected tab role for post-authentication redirection
      localStorage.setItem('selected_tab_role', activeTab);
      
      // Pass the selected tab role to the signIn function
      const result = await signIn(email, password, activeTab);
      
      if (!result.success) {
        throw new Error("Login failed");
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigate based on selected tab role
      if (activeTab === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo credentials helper
  const fillDemoCredentials = (type: 'seller' | 'buyer') => {
    if (type === 'seller') {
      setEmail('demoseller@gmail.com');
      setPassword('demoseller123');
      setActiveTab('seller'); // Update active tab to match the demo type
    } else {
      setEmail('demobuyer@gmail.com');
      setPassword('demobuyer123');
      setActiveTab('buyer'); // Update active tab to match the demo type
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    authLoading,
    activeTab,
    setActiveTab,
    handleEmailLogin,
    handleEmailSignIn,
    fillDemoCredentials
  };
};
