import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-destructive to-primary flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>
            <p className="text-lg text-foreground/70 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/">
              <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Button variant="outline" className="border-primary/30 text-base h-12 px-8 hover:bg-card hover:border-primary/50">
              View Machines
            </Button>
          </div>

          <div className="pt-8 border-t border-border max-w-md mx-auto">
            <p className="text-sm text-foreground/60 mb-4">
              Want to suggest a new feature or page? Let us know!
            </p>
            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
