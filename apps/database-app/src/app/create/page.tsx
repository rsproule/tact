"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/components/user-context";
import { GameSettings } from "@tact/game-logic";
import { validateGameSettings } from "@tact/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateGamePage() {
  const { userId } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Store form data as strings to allow empty values
  const [formData, setFormData] = useState({
    maxPlayers: "4",
    boardSize: "9",
    epochMinutes: "30", // Store as minutes for better UX
    initHearts: "3",
    initAps: "1",
    initRange: "3",
    entryCost: "0",
    epochMaxActionPoints: "3",
  });

  // Validation function that returns field-specific errors
  const validateFields = () => {
    const errors: Record<string, string> = {};

    // Max Players validation
    const maxPlayers = parseInt(formData.maxPlayers);
    if (
      !formData.maxPlayers ||
      isNaN(maxPlayers) ||
      maxPlayers < 2 ||
      maxPlayers > 10
    ) {
      errors.maxPlayers = "Must be a number between 2 and 10";
    }

    // Board Size validation
    const boardSize = parseInt(formData.boardSize);
    if (
      !formData.boardSize ||
      isNaN(boardSize) ||
      boardSize < 3 ||
      boardSize > 48 ||
      boardSize % 3 !== 0
    ) {
      errors.boardSize = "Must be a number between 3-48, divisible by 3";
    }

    // Epoch Minutes validation
    const epochMinutes = parseInt(formData.epochMinutes);
    if (
      !formData.epochMinutes ||
      isNaN(epochMinutes) ||
      epochMinutes < 1
    ) {
      errors.epochMinutes = "Must be a positive number";
    }

    // Init Hearts validation
    const initHearts = parseInt(formData.initHearts);
    if (
      !formData.initHearts ||
      isNaN(initHearts) ||
      initHearts < 1 ||
      initHearts > 10
    ) {
      errors.initHearts = "Must be a number between 1 and 10";
    }

    // Init APs validation
    const initAps = parseInt(formData.initAps);
    if (!formData.initAps || isNaN(initAps) || initAps < 1 || initAps > 10) {
      errors.initAps = "Must be a number between 1 and 10";
    }

    // Init Range validation
    const initRange = parseInt(formData.initRange);
    if (
      !formData.initRange ||
      isNaN(initRange) ||
      initRange < 1 ||
      initRange > 10
    ) {
      errors.initRange = "Must be a number between 1 and 10";
    }

    // Epoch Max APs validation
    const epochMaxAps = parseInt(formData.epochMaxActionPoints);
    if (
      !formData.epochMaxActionPoints ||
      isNaN(epochMaxAps) ||
      epochMaxAps < 1 ||
      epochMaxAps > 20
    ) {
      errors.epochMaxActionPoints = "Must be a number between 1 and 20";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Validate all fields first
    if (!validateFields()) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const settings: GameSettings = {
        playerCount: parseInt(formData.maxPlayers),
        boardSize: parseInt(formData.boardSize),
        epochSeconds: parseInt(formData.epochMinutes) * 60,
        revealWaitBlocks: 5, // Not used in database mode
        initHearts: parseInt(formData.initHearts),
        initAps: parseInt(formData.initAps),
        initRange: parseInt(formData.initRange),
        entryCost: formData.entryCost,
        minPlayers: 2,
        maxPlayers: parseInt(formData.maxPlayers),
        epochMaxActionPoints: parseInt(formData.epochMaxActionPoints),
      };

      // Additional validation using the utils function
      const validation = validateGameSettings(settings);
      if (!validation.valid) {
        setError(validation.errors.join(", "));
        return;
      }

      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings,
          creator: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create game");
      }

      const { gameId } = await response.json();
      router.push(`/games/${gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="pt-16 min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-lg text-white">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      {/* Logo Header */}
      <div className="text-center py-8 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Game</h1>
        <p className="text-gray-400">Configure your game settings</p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Game Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Customize the rules and parameters for your game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Max Players</Label>
                  <Select
                    value={formData.maxPlayers}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, maxPlayers: value }))
                    }
                  >
                    <SelectTrigger
                      className={`bg-gray-700 border-gray-600 text-white ${
                        fieldErrors.maxPlayers ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem
                        value="2"
                        className="text-white hover:bg-gray-600"
                      >
                        2 Players
                      </SelectItem>
                      <SelectItem
                        value="3"
                        className="text-white hover:bg-gray-600"
                      >
                        3 Players
                      </SelectItem>
                      <SelectItem
                        value="4"
                        className="text-white hover:bg-gray-600"
                      >
                        4 Players
                      </SelectItem>
                      <SelectItem
                        value="6"
                        className="text-white hover:bg-gray-600"
                      >
                        6 Players
                      </SelectItem>
                      <SelectItem
                        value="8"
                        className="text-white hover:bg-gray-600"
                      >
                        8 Players
                      </SelectItem>
                      <SelectItem
                        value="10"
                        className="text-white hover:bg-gray-600"
                      >
                        10 Players
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.maxPlayers && (
                    <p className="text-sm text-red-400">
                      {fieldErrors.maxPlayers}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Board Size</Label>
                  <Input
                    type="number"
                    value={formData.boardSize}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        boardSize: e.target.value,
                      }))
                    }
                    onBlur={validateFields}
                    min="3"
                    max="48"
                    step="3"
                    placeholder="Enter board size (3, 6, 9, 12...)"
                    className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                      fieldErrors.boardSize ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.boardSize && (
                    <p className="text-sm text-red-400">
                      {fieldErrors.boardSize}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Board size determines the hex grid radius. Must be divisible
                    by 3. Larger sizes support more players.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Epoch Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.epochMinutes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        epochMinutes: e.target.value,
                      }))
                    }
                    onBlur={validateFields}
                    min="1"
                    placeholder="Enter duration in minutes"
                    className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                      fieldErrors.epochMinutes ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.epochMinutes && (
                    <p className="text-sm text-red-400">
                      {fieldErrors.epochMinutes}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Initial Hearts</Label>
                  <Input
                    type="number"
                    value={formData.initHearts}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        initHearts: e.target.value,
                      }))
                    }
                    onBlur={validateFields}
                    min="1"
                    max="10"
                    placeholder="Enter initial hearts"
                    className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                      fieldErrors.initHearts ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.initHearts && (
                    <p className="text-sm text-red-400">
                      {fieldErrors.initHearts}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Initial Action Points</Label>
                  <Input
                    type="number"
                    value={formData.initAps}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        initAps: e.target.value,
                      }))
                    }
                    onBlur={validateFields}
                    min="1"
                    max="10"
                    placeholder="Enter initial APs"
                    className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                      fieldErrors.initAps ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.initAps && (
                    <p className="text-sm text-red-400">
                      {fieldErrors.initAps}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Initial Range</Label>
                  <Input
                    type="number"
                    value={formData.initRange}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        initRange: e.target.value,
                      }))
                    }
                    onBlur={validateFields}
                    min="1"
                    max="10"
                    placeholder="Enter initial range"
                    className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                      fieldErrors.initRange ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.initRange && (
                    <p className="text-sm text-red-400">
                      {fieldErrors.initRange}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Max APs per Epoch</Label>
                  <Input
                    type="number"
                    value={formData.epochMaxActionPoints}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        epochMaxActionPoints: e.target.value,
                      }))
                    }
                    onBlur={validateFields}
                    min="1"
                    max="20"
                    placeholder="Enter max APs per epoch"
                    className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                      fieldErrors.epochMaxActionPoints ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.epochMaxActionPoints && (
                    <p className="text-sm text-red-400">
                      {fieldErrors.epochMaxActionPoints}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <Card className="bg-red-900/20 border-red-500/50">
                  <CardContent className="pt-6">
                    <p className="text-red-400 text-sm">{error}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Creating..." : "Create Game"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
