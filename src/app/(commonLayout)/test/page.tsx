import { DashboardSkeleton } from '@/components/shared/DashboardSkeleton';
import HeartbeatLoader from '@/components/shared/HeartbeatLoader';
import { ManagementPageLoading } from '@/components/shared/ManagementPageLoader';

const page = () => {
  return (
    <div>
      <DashboardSkeleton />
      <HeartbeatLoader />
      <ManagementPageLoading
        columns={10}
        hasActionButton
        filterCount={5}
        filterWidths={['w-48', 'w-32', 'w-40', 'w-24', 'w-36']}
      />
    </div>
  );
};

export default page;
