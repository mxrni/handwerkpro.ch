import { MainContent } from "@/components/main-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ServerCrash,
  WifiOff,
} from "lucide-react";

interface ErrorPageProps {
  error: Error;
  reset?: () => void;
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  // Determine error type and icon
  const getErrorDetails = () => {
    const message = error.message.toLowerCase();

    if (message.includes("fetch") || message.includes("network")) {
      return {
        icon: WifiOff,
        title: "Verbindungsfehler",
        description:
          "Es konnte keine Verbindung zum Server hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung.",
      };
    }

    if (message.includes("404") || message.includes("not found")) {
      return {
        icon: AlertTriangle,
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource konnte nicht gefunden werden.",
      };
    }

    if (message.includes("500") || message.includes("server")) {
      return {
        icon: ServerCrash,
        title: "Serverfehler",
        description:
          "Ein Fehler ist auf dem Server aufgetreten. Bitte versuchen Sie es später erneut.",
      };
    }

    return {
      icon: AlertTriangle,
      title: "Ein Fehler ist aufgetreten",
      description: error.message || "Ein unerwarteter Fehler ist aufgetreten.",
    };
  };

  const { icon: Icon, title, description } = getErrorDetails();

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  const handleRefresh = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <MainContent
      title="Fehler"
      description="Es ist ein Problem aufgetreten"
      icon={<Icon className="h-6 w-6 text-destructive" />}
    >
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md border-destructive/50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <Icon className="h-10 w-10 text-destructive" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {import.meta.env.DEV && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Technische Details
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded-md overflow-auto max-h-40">
                  {error.stack || error.message}
                </pre>
              </details>
            )}
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex-1 gap-2"
            >
              <Home className="h-4 w-4" />
              Zur Startseite
            </Button>
            <Button onClick={handleRefresh} className="flex-1 gap-2">
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainContent>
  );
}
