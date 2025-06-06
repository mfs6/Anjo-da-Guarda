import type { NutritionTip } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface NutritionCardProps {
  tip: NutritionTip;
}

export function NutritionCard({ tip }: NutritionCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader>
        <CardTitle className="font-headline text-lg text-primary flex items-center gap-2">
            <Lightbulb className="text-yellow-500" />
            {tip.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{tip.content}</p>
      </CardContent>
    </Card>
  );
}
