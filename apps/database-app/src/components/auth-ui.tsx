'use client';

import { useState } from 'react';
import { useUser } from './user-context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function AuthUI() {
  const { user, loading, signUp, signIn, signOut } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
      
      // Clear form
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string, userPassword: string, name: string) => {
    setAuthLoading(true);
    setError(null);

    try {
      // Try to sign in first
      await signIn(userEmail, userPassword);
    } catch (signInError) {
      // If sign in fails, try to create the account
      try {
        await signUp(userEmail, userPassword, name);
        setError('Account created! Please check your email to verify your account, then try signing in.');
      } catch (signUpError) {
        setError(signUpError instanceof Error ? signUpError.message : 'Authentication failed');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return null; // Don't show anything while auth is loading
  }

  if (user) {
    return null; // Navbar handles auth when logged in
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUp 
              ? 'Create a new account to play Tact' 
              : 'Sign in to your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instructions for testing */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-card-foreground">For Testing Multiple Users:</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>1. Create accounts with different emails you can access</p>
              <p>2. Verify each email address</p>
              <p>3. Use different browser tabs/incognito windows</p>
              <p>4. Or disable email confirmation in Supabase settings</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={authLoading}
                className="bg-input border-border text-input-foreground placeholder-muted-foreground focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={authLoading}
                minLength={6}
                className="bg-input border-border text-input-foreground placeholder-muted-foreground focus:border-primary"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-foreground">Display Name (optional)</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={authLoading}
                  className="bg-input border-border text-input-foreground placeholder-muted-foreground focus:border-primary"
                />
              </div>
            )}

            {error && (
              <Card className="border-destructive bg-destructive/20">
                <CardContent className="pt-6">
                  <p className="text-destructive text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
              disabled={authLoading}
            >
              {authLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              disabled={authLoading}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}