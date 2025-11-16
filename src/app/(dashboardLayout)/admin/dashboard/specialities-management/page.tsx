import SpecialitiesManagementHeader from '@/components/modules/Admin/SpecialitiesManagement/SpecialitiesManagementHeader';
import SpecialitiesTable from '@/components/modules/Admin/SpecialitiesManagement/SpecialitiesTable';
import RefreshButton from '@/components/shared/RefreshButton';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { getSpecialties } from '@/services/admin/specialtiesManagement';
import { Suspense } from 'react';

const AdminSpecialitiesManagementPage = async () => {
  const result = await getSpecialties();

  return (
    <div className='space-y-6'>
      <SpecialitiesManagementHeader />
      <div className='flex'>
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
        <SpecialitiesTable specialities={result.data} />
      </Suspense>
    </div>
  );
};
export default AdminSpecialitiesManagementPage;
