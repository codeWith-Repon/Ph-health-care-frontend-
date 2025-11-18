import DoctorsManagementHeader from '@/components/modules/Admin/DoctorsManagement/DoctorsManagementHeader';
import DoctorTable from '@/components/modules/Admin/DoctorsManagement/DoctorTable';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TablePagination from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { queryStringFormatter } from '@/lib/formatter';
import { getDoctors } from '@/services/admin/doctorManagement';
import { getSpecialties } from '@/services/admin/specialtiesManagement';
import { ISpecialty } from '@/types/specialities.interface';
import { Suspense } from 'react';

const AdminDoctorsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const specialitiesResult = await getSpecialties();
  const doctorsResult = await getDoctors(queryString);
  const totalPages = Math.ceil(
    doctorsResult.meta.total / doctorsResult.meta.limit
  );
  return (
    <div className='space-y-6'>
      <DoctorsManagementHeader specialities={specialitiesResult.data} />
      <div className='flex space-x-2'>
        <SearchFilter paramName='searchTerm' placeholder='Search doctors...' />
        <SelectFilter
          paramName='specialties'
          options={specialitiesResult.data.map((specialty: ISpecialty) => ({
            label: specialty.title,
            value: specialty.title,
          }))}
          placeholder='Filter by specialty'
        />
        <SelectFilter
          paramName='gender'
          options={[
            { label: 'Male', value: 'MALE' },
            { label: 'Female', value: 'FEMALE' },
          ].map((specialty) => ({
            label: specialty.label,
            value: specialty.value,
          }))}
          placeholder='gender'
        />
        <RefreshButton />
      </div>
      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <DoctorTable
          doctors={doctorsResult.data}
          specialities={specialitiesResult.data}
        />
        <TablePagination
          currentPage={doctorsResult.meta.page}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
};

export default AdminDoctorsManagementPage;
