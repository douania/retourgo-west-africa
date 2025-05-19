
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { RouteOptimizationResult } from "./types";

interface ResultSummaryProps {
  result: RouteOptimizationResult;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const { t } = useTranslation();
  
  if (!result) return null;

  return (
    <div className="mt-6 space-y-4 bg-secondary/30 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("ai.optimized_route")}</h3>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-500">{t("ai.distance")}</span>
            <p className="font-medium">{result.route.distance} km</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">{t("ai.duration")}</span>
            <p className="font-medium">{result.route.duration} h</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500">{t("ai.route_summary")}</h4>
        <p className="mt-1">{result.route.summary}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-medium text-gray-500">{t("ai.route_path")}</h4>
          <ul className="mt-1 list-disc list-inside space-y-1">
            {result.route.route.map((step: string, i: number) => (
              <li key={i} className="text-sm">{step}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">{t("ai.rest_points")}</h4>
          <ul className="mt-1 list-disc list-inside space-y-1">
            {result.route.restPoints.map((point: string, i: number) => (
              <li key={i} className="text-sm">{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500">{t("ai.avoid_areas")}</h4>
        <ul className="mt-1 list-disc list-inside space-y-1">
          {result.route.avoidAreas.map((area: string, i: number) => (
            <li key={i} className="text-sm">{area}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500">{t("ai.checkpoints")}</h4>
        <ul className="mt-1 list-disc list-inside space-y-1">
          {result.route.checkpoints.map((checkpoint: string, i: number) => (
            <li key={i} className="text-sm">{checkpoint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultSummary;
