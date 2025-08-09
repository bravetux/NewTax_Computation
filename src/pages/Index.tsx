import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <div className="text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Bravetux Tax Planning App</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Your personal tax planning assistant.
        </p>
        <Link to="/tax-dashboard">
          <Button size="lg" className="text-lg px-8 py-4">Go to Tax Dashboard</Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;