import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const TOP_COMPANIES = [
  "Google", "Amazon", "Microsoft", "Apple", "Meta",
  "Netflix", "Tesla", "Nvidia", "Adobe", "Salesforce",
  "Oracle", "IBM", "Intel", "Cisco", "VMware",
  "Uber", "Lyft", "Airbnb", "Stripe", "Square",
  "Twitter", "LinkedIn", "Snap", "Pinterest", "Reddit",
  "Shopify", "Atlassian", "Zoom", "Slack", "Dropbox",
  "PayPal", "Visa", "Mastercard", "American Express", "Goldman Sachs",
  "JPMorgan", "Morgan Stanley", "Bloomberg", "Citadel", "Two Sigma",
  "Jane Street", "DE Shaw", "Palantir", "Databricks", "Snowflake",
  "Confluent", "MongoDB", "Elastic", "Splunk", "ServiceNow",
  "Workday", "Intuit", "Autodesk", "DocuSign", "Twilio",
  "Cloudflare", "Fastly", "Akamai", "Okta", "CrowdStrike",
  "Palo Alto Networks", "Fortinet", "Zscaler", "SentinelOne", "Datadog",
  "New Relic", "Dynatrace", "Sumo Logic", "PagerDuty", "Opsgenie",
  "HashiCorp", "GitLab", "GitHub", "Bitbucket", "JFrog",
  "Vercel", "Netlify", "DigitalOcean", "Linode", "Vultr",
  "Roblox", "Unity", "Epic Games", "EA", "Activision",
  "Spotify", "SoundCloud", "Pandora", "Deezer", "TikTok",
  "ByteDance", "Tencent", "Alibaba", "Baidu", "JD.com",
  "Samsung", "Sony", "LG", "Huawei", "Xiaomi"
];

interface CompanyListProps {
  selectedCompany: string | null;
  onSelectCompany: (company: string) => void;
  isLoading: boolean;
}

export function CompanyList({ selectedCompany, onSelectCompany, isLoading }: CompanyListProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Top 100 Companies</h3>
      </div>
      
      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {TOP_COMPANIES.map((company, index) => (
            <button
              key={company}
              onClick={() => onSelectCompany(company)}
              disabled={isLoading}
              className={cn(
                "relative p-3 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:scale-105 hover:shadow-md",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                selectedCompany === company
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <span className="absolute top-1 left-2 text-[10px] opacity-50">
                #{index + 1}
              </span>
              <span className="block mt-2 truncate">{company}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
