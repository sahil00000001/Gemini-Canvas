import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";

interface PriorityImprovementsProps {
  improvements: string[];
}

const severityConfigs: Record<string, {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  icon: typeof AlertTriangle;
  iconColor: string;
  glowColor: string;
}> = {
  critical: {
    label: "Critical",
    bgClass: "bg-gray-900",
    textClass: "text-white",
    borderClass: "border-red-500",
    badgeBg: "bg-red-600",
    badgeText: "text-white",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    glowColor: "shadow-red-500/30",
  },
  medium: {
    label: "Medium",
    bgClass: "bg-amber-950",
    textClass: "text-amber-50",
    borderClass: "border-yellow-500",
    badgeBg: "bg-yellow-500",
    badgeText: "text-gray-900",
    icon: AlertCircle,
    iconColor: "text-yellow-500",
    glowColor: "shadow-yellow-500/30",
  },
  optional: {
    label: "Optional",
    bgClass: "bg-emerald-950",
    textClass: "text-emerald-50",
    borderClass: "border-green-500",
    badgeBg: "bg-green-500",
    badgeText: "text-gray-900",
    icon: Lightbulb,
    iconColor: "text-green-500",
    glowColor: "shadow-green-500/30",
  },
};

function parseSeverity(improvement: string): { severity: string; text: string } {
  const criticalMatch = improvement.match(/^\[CRITICAL\]\s*/i);
  const mediumMatch = improvement.match(/^\[MEDIUM\]\s*/i);
  const optionalMatch = improvement.match(/^\[OPTIONAL\]\s*/i);
  
  if (criticalMatch) {
    return { severity: "critical", text: improvement.replace(criticalMatch[0], "") };
  } else if (mediumMatch) {
    return { severity: "medium", text: improvement.replace(mediumMatch[0], "") };
  } else if (optionalMatch) {
    return { severity: "optional", text: improvement.replace(optionalMatch[0], "") };
  }
  
  return { severity: "medium", text: improvement };
}

const defaultSeverityOrder = ["critical", "medium", "optional"];

export function PriorityImprovements({ improvements }: PriorityImprovementsProps) {
  if (!improvements || improvements.length === 0) return null;

  return (
    <div className="mb-8">
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-1 w-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
        <h2 className="text-2xl font-display font-bold text-foreground">
          Top 3 Priority Improvements
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-5">
        {improvements.slice(0, 3).map((improvement, idx) => {
          const { severity, text } = parseSeverity(improvement);
          const config = severityConfigs[severity] || severityConfigs.medium;
          const Icon = config.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                delay: idx * 0.15,
                duration: 0.5,
                type: "spring",
                stiffness: 100,
              }}
              className={`
                relative overflow-hidden rounded-2xl border-2 ${config.borderClass}
                ${config.bgClass} ${config.glowColor} shadow-lg
                hover:scale-[1.02] hover:shadow-xl transition-all duration-300
              `}
              data-testid={`priority-card-${idx + 1}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`
                    flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center
                    ${config.bgClass === 'bg-gray-900' ? 'bg-gray-800' : 'bg-black/20'}
                    border ${config.borderClass}
                  `}>
                    <Icon className={`w-7 h-7 ${config.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`
                        inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide
                        ${config.badgeBg} ${config.badgeText}
                      `}>
                        {config.label}
                      </span>
                      <span className={`text-sm font-medium ${config.textClass} opacity-70`}>
                        Priority #{idx + 1}
                      </span>
                    </div>
                    
                    <p className={`text-base leading-relaxed ${config.textClass}`} data-testid={`priority-text-${idx + 1}`}>
                      {text}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full ${config.iconColor} opacity-5 blur-2xl transform translate-x-8 translate-y-8`} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
