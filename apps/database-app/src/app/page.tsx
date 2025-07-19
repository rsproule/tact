'use client';

import Link from 'next/link';
import { useUser } from '@/components/user-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const { userId } = useUser();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4">Tact</h1>
        <p className="text-xl text-muted-foreground mb-2">
          An onchain strategy game
        </p>
        <p className="text-sm text-blue-600 font-medium">
          Database Mode - Instant Gameplay
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to Tact</CardTitle>
          <CardDescription>
            A game of trust in an environment of no trust. This is the database version 
            that allows you to start playing immediately without blockchain complexity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Instant gameplay - no wallet required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Same game rules as blockchain version</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Perfect for testing and prototyping</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        {userId && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Your Player ID: <code className="font-mono">{userId}</code>
              </p>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/games">Join Game</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/create">Create Game</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6 text-center">Game Rules</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <li>• Move to adjacent hexagon (1 AP)</li>
                <li>• Shoot tanks in range (1 AP)</li>
                <li>• Upgrade your range (cost varies)</li>
                <li>• Give hearts/APs to other players</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Victory Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <li>• Start with 3 hearts and 1 AP</li>
                <li>• Gain 1 AP every epoch (30 min)</li>
                <li>• Last player standing wins</li>
                <li>• Dead players can be revived</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}