
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { SymptomCheckerResult } from "@/lib/types";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface TriageResultAlertProps {
    result: SymptomCheckerResult;
}

export function TriageResultAlert({ result }: TriageResultAlertProps) {
    
    const getResultAlertIcon = () => {
        if (!result) return <Info className="h-4 w-4" />;
        switch (result.severity) {
            case 'Crítica':
            case 'Alta':
                return <AlertTriangle className="h-4 w-4" />;
            case 'Média':
                return <Info className="h-4 w-4" />;
            case 'Baixa':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const getResultAlertVariantClass = () => {
        if (!result) return "bg-blue-100 border-blue-400 text-blue-800";
        switch (result.severity) {
            case 'Crítica':
            case 'Alta':
                return "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300";
            case 'Média':
                return "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-300";
            case 'Baixa':
                return "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300";
            default:
                return "bg-blue-100 border-blue-400 text-blue-800";
        }
    };
    
    const getAlertTextColor = () => {
         if (!result) return "text-blue-800";
         switch (result.severity) {
             case 'Crítica':
             case 'Alta':
                 return "text-red-800 dark:text-red-300";
             case 'Média':
                 return "text-yellow-800 dark:text-yellow-300";
             case 'Baixa':
                 return "text-green-800 dark:text-green-300";
             default:
                 return "text-blue-800";
         }
    }

    return (
         <div className="space-y-4 pt-4 animate-in fade-in-50">
             <Alert className={getResultAlertVariantClass()}>
              <div className={getAlertTextColor()}>
                {getResultAlertIcon()}
              </div>
              <AlertTitle className={`font-headline font-bold ${getAlertTextColor()}`}>
                Resultado da Triagem: {result.severity}
              </AlertTitle>
              <AlertDescription className={getAlertTextColor()}>
                <p className="font-semibold mt-2">{result.suggestion}</p>
                {result.shouldSeeDoctor && <p className="mt-2"><strong>Recomendação: Procure um médico.</strong></p>}
              </AlertDescription>
            </Alert>
         </div>
    );
}
