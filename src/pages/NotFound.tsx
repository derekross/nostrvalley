import { useSeoMeta } from "@unhead/react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useSeoMeta({
    title: "404 - Page Not Found",
    description: "The page you are looking for could not be found. Return to the home page to continue browsing.",
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-32">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Page not found</p>
          <a href="/" className="text-primary hover:underline font-medium">
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
