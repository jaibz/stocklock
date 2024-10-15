import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
      <h2 className="text-4xl font-bold mb-4 text-center text-primary">AI-Powered Stock Analysis</h2>
      <p className="text-center mb-4 text-muted-foreground text-lg">
        Ask questions about stocks, get recommendations, compare companies, and analyze market trends.
      </p>
      <div className="flex-grow overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}