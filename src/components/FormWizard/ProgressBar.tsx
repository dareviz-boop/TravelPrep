import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  maxStepReached: number;
  onStepClick: (stepIndex: number) => void;
}

export const ProgressBar = ({ currentStep, totalSteps, stepTitles, maxStepReached, onStepClick }: ProgressBarProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {stepTitles.map((title, index) => {
          const isClickable = index <= maxStepReached;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div
                  onClick={() => isClickable && onStepClick(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground scale-110"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                      : "bg-muted text-muted-foreground"
                  } ${
                    isClickable ? "cursor-pointer hover:scale-125 hover:ring-2 hover:ring-primary/30" : "cursor-not-allowed"
                  }`}
                  title={isClickable ? `Aller à l'étape ${index + 1}` : "Étape non encore accessible"}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-xs mt-2 font-medium hidden sm:block ${
                  isCurrent ? "text-primary" : "text-muted-foreground"
                }`}>
                  {title}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div className="flex-1 h-1 mx-2 relative overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full bg-primary transition-all duration-500 ${
                      index < currentStep ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
