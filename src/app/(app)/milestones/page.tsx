import { MilestoneTracker } from '@/components/features/milestones/MilestoneTracker';

export default function MilestonesPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 sr-only">Rastreamento de Marcos</h1>
      <MilestoneTracker />
    </div>
  );
}
