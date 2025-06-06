import { NutritionGuide } from '@/components/features/nutrition/NutritionGuide';

export default function NutritionPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 sr-only">Orientação Nutricional</h1>
      <NutritionGuide />
    </div>
  );
}
