
import React from 'react';
import LoginCard from '@/components/auth/LoginCard';
import { useLoginForm } from '@/hooks/useLoginForm';

const Login = () => {
  const {
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
  } = useLoginForm();

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-10">
      <LoginCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        authLoading={authLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleEmailLogin={handleEmailLogin}
        handleEmailSignIn={handleEmailSignIn}
        fillDemoCredentials={fillDemoCredentials}
      />
    </div>
  );
};

export default Login;
