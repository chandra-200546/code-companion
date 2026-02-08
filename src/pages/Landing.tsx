import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code2, 
  Zap, 
  Brain, 
  Mic, 
  GraduationCap, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import algocruxLogo from "@/assets/algocrux-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: Code2,
    title: "Code Translation",
    description: "Seamlessly translate code between C++, Java, Python, and JavaScript with AI-powered accuracy.",
  },
  {
    icon: Zap,
    title: "Complexity Optimizer",
    description: "Analyze and optimize your algorithms for better time and space complexity.",
  },
  {
    icon: Mic,
    title: "Voice Chat",
    description: "Talk through coding problems naturally with AI-powered voice conversations.",
  },
  {
    icon: GraduationCap,
    title: "Interview Prep",
    description: "Practice with 100+ DSA questions from top tech companies like Google, Meta, and Amazon.",
  },
];

const benefits = [
  "AI-powered code analysis and translation",
  "Step-by-step algorithm explanations",
  "Time & space complexity optimization",
  "Company-specific interview questions",
  "Support for C++, Java, Python, JavaScript",
  "Voice-enabled coding assistant",
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={algocruxLogo} alt="AlgoCrux" className="w-10 h-10" />
            <span className="text-xl font-bold text-gradient">AlgoCrux</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full scale-150" />
              <img src={algocruxLogo} alt="AlgoCrux" className="relative w-24 h-24 md:w-32 md:h-32" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Master </span>
            <span className="text-gradient">Algorithms</span>
            <br />
            <span className="text-foreground">Ace </span>
            <span className="text-gradient">Interviews</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your AI-powered companion for learning data structures, optimizing algorithms, 
            and preparing for technical interviews at top tech companies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="glow-primary" asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Start Learning Free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Explore Features</a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Powered by AI</span>
            <span className="text-border">•</span>
            <span>Free to start</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-20 bg-card/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to <span className="text-gradient">level up</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From code translation to interview prep, AlgoCrux gives you the tools 
              to become a better programmer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why developers love <span className="text-gradient">AlgoCrux</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Whether you're learning DSA for the first time or preparing for FAANG interviews, 
                our AI-powered tools help you understand concepts deeply and practice efficiently.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
              <Card className="relative bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-8 h-8 text-primary" />
                    <span className="text-lg font-semibold">AI Code Analysis</span>
                  </div>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="p-3 rounded bg-background/50 border border-border">
                      <span className="text-muted-foreground">// Original: O(n²)</span>
                      <br />
                      <span className="text-destructive">for (i in arr) for (j in arr)</span>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <div className="p-3 rounded bg-background/50 border border-primary/50">
                      <span className="text-muted-foreground">// Optimized: O(n)</span>
                      <br />
                      <span className="text-primary">hashMap.get(target - num)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-card/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-gradient">ace your interviews</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of developers who use AlgoCrux to improve their coding skills 
            and land their dream jobs.
          </p>
          <Button size="lg" className="glow-primary" asChild>
            <Link to={user ? "/dashboard" : "/auth"}>
              {user ? "Go to Dashboard" : "Get Started for Free"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={algocruxLogo} alt="AlgoCrux" className="w-8 h-8" />
              <span className="font-semibold">AlgoCrux</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for learning and understanding • AI-powered code translation & optimization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
