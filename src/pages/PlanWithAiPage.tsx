import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showError, showSuccess, showLoading, dismissToast } from "@/utils/toast";
import { Upload, Download, Save, Sparkles, Eye, EyeOff, Bot } from "lucide-react";

const AI_MODELS = {
  openai: ["gpt-4o-mini", "gpt-3.5-turbo"],
  google: ["gemini-1.5-flash", "gemini-1.5-pro"],
  openrouter: ["mistralai/mistral-7b-instruct-v0.2", "google/gemini-flash-1.5", "openai/gpt-4o-mini"],
};

const PlanWithAiPage: React.FC = () => {
  const [provider, setProvider] = useState<keyof typeof AI_MODELS>("openai");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS.openai[0]);
  const [prompt, setPrompt] = useState("Based on my income and capital gains data in this application, suggest some tax-saving strategies.");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedModel(AI_MODELS[provider][0]);
  }, [provider]);

  const handleExportConfig = () => {
    const config = { provider, apiKey, selectedModel };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "ai-config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showSuccess("AI configuration exported!");
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const config = JSON.parse(text);
        if (config.provider && config.apiKey && config.selectedModel) {
          setProvider(config.provider);
          setApiKey(config.apiKey);
          setSelectedModel(config.selectedModel);
          showSuccess("AI configuration imported successfully!");
        } else {
          showError("Invalid configuration file.");
        }
      } catch (err) {
        showError("Failed to parse configuration file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const saveToFile = (content: string, filename: string, successMessage: string) => {
    if (!content) {
      showError("There is no content to save.");
      return;
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSuccess(successMessage);
  };

  const handleSubmit = async () => {
    const toastId = showLoading("Simulating AI response...");
    setIsLoading(true);
    setResponse("");

    setTimeout(() => {
      dismissToast(toastId);
      showError("This is a UI demonstration. Connecting to live AI models requires a secure backend to protect your API key and cannot be done directly from the browser.");
      setResponse("This is a mock response demonstrating the UI. In a real application, the AI's answer, based on your financial data and prompt, would appear here. For example, it might suggest investing in ELSS funds, making voluntary provident fund contributions, or maximizing deductions under Section 80C.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50 flex items-center justify-center">
          <Sparkles className="mr-3 h-8 w-8 text-primary" /> Plan with AI
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">AI Provider</Label>
                  <Select value={provider} onValueChange={(v) => setProvider(v as keyof typeof AI_MODELS)}>
                    <SelectTrigger id="provider"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="openrouter">OpenRouter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="model"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AI_MODELS[provider].map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <div className="relative">
                  <Input id="api-key" type={showApiKey ? "text" : "password"} placeholder="Enter your API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Import Config</Button>
                <Button variant="outline" onClick={handleExportConfig}><Download className="mr-2 h-4 w-4" /> Export Config</Button>
                <input type="file" ref={fileInputRef} onChange={handleImportConfig} accept=".json" className="hidden" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Prompt</CardTitle>
              <Button variant="outline" size="sm" onClick={() => saveToFile(prompt, "ai-prompt.txt", "Prompt saved!")}><Save className="mr-2 h-4 w-4" /> Save</Button>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter your prompt here..." className="min-h-[120px]" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Thinking..." : <><Bot className="mr-2 h-4 w-4" /> Get Advice</>}
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI Response</CardTitle>
              <Button variant="outline" size="sm" onClick={() => saveToFile(response, "ai-response.txt", "Response saved!")}><Save className="mr-2 h-4 w-4" /> Save</Button>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert prose-sm min-h-[120px] w-full rounded-md border bg-muted px-3 py-2">
                {isLoading ? <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-spin" />Generating response...</div> : <p>{response}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default PlanWithAiPage;