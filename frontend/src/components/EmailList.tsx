import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Email {
  _id: string; 
  sender: string;
  senderEmail: string;
  subject: string;
  category: "business-lead" | "report" | "general";
  timestamp: string; 
  preview: string;
}

const getCategoryConfig = (category: Email["category"]) => {
  switch (category) {
    case "business-lead":
      return {
        label: "Business Lead",
        className: "bg-business-lead-light text-business-lead border-business-lead/20",
      };
    case "report":
      return {
        label: "Report",
        className: "bg-report-light text-report border-report/20",
      };
    default:
      return {
        label: "General",
        className: "bg-general-light text-general border-general/20",
      };
  }
};

export const EmailList = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://email-manager-backend-aq68.onrender.com") 
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching emails:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle>Recent Emails</CardTitle>
        <CardDescription>Latest processed emails from sales.finigenie@gmail.com</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading emails...</p>
        ) : emails.length === 0 ? (
          <p className="text-sm text-muted-foreground">No emails found.</p>
        ) : (
          emails.map((email) => {
            const categoryConfig = getCategoryConfig(email.category);
            const initials = email.sender
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={email._id}
                className="flex gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-medium text-sm">{email.sender}</p>
                      <p className="text-xs text-muted-foreground">{email.senderEmail}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={categoryConfig.className}>
                        {categoryConfig.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(email.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <p className="font-medium text-sm mb-1">{email.subject}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{email.preview}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
