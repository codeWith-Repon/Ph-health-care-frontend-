import MySchedulesFilters from '@/components/modules/Doctor/MySchedules/MyScheduleFilters';
import MyScheduleHeader from '@/components/modules/Doctor/MySchedules/MyScheduleHeader';
import MySchedulesTable from '@/components/modules/Doctor/MySchedules/MyScheduleTable';
import TablePagination from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { queryStringFormatter } from '@/lib/formatter';
import {
  getAvailableSchedules,
  getDoctorOwnSchedules,
} from '@/services/doctor/doctorSchedule.services';
import { Suspense } from 'react';

interface DoctorMySchedulesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    isBooked?: string;
  }>;
}

const MySchedulesPage = async ({
  searchParams,
}: DoctorMySchedulesPageProps) => {
  const params = await searchParams;

  const queryString = queryStringFormatter(params);
  const myDoctorsScheduleResponse = await getDoctorOwnSchedules(queryString);
  const availableSchedulesResponse = await getAvailableSchedules();

  const schedules = myDoctorsScheduleResponse?.data || [];
  const meta = myDoctorsScheduleResponse?.meta;
  const totalPages = Math.ceil((meta?.total || 1) / (meta?.limit || 1));

  return (
    <div className='space-y-6'>
      <MyScheduleHeader
        availableSchedules={availableSchedulesResponse?.data || []}
      />
      <MySchedulesFilters />

      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <MySchedulesTable schedules={schedules} />
        <TablePagination
          currentPage={meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default MySchedulesPage;
