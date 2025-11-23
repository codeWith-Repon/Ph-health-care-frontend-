'use client';

import ClearFiltersButton from '@/components/shared/ClearFiltersButton';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';

const AppointmentsFilter = () => (
  <div className='space-y-3'>
    {/* Row 1: refresh */}
    <div className='flex items-center gap-3'>
      <RefreshButton />
    </div>

    {/* Row 2. Filter Controls  */}
    <div className='flex items-center gap-3'>
      <SelectFilter
        paramName='status'
        placeholder='Appointment Status'
        defaultValue='All Appointment Statuses'
        options={[
          { label: 'Scheduled', value: 'SCHEDULED' },
          { label: 'In Progress', value: 'INPROGRESS' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ]}
      />

      {/* Payment Status Filter */}
      <SelectFilter
        paramName='paymentStatus'
        placeholder='Payment Status'
        defaultValue='All Payment Status'
        options={[
          { label: 'Paid', value: 'PAID' },
          { label: 'Unpaid', value: 'UNPAID' },
        ]}
      />

      {/* patient Email Filter */}
      <SearchFilter paramName='patientEmail' placeholder='Patient Email' />

      {/* Doctor Email Filter  */}
      <SearchFilter paramName='doctorEmail' placeholder='Doctor Email' />

      {/* clear Filters */}
      <ClearFiltersButton />
    </div>
  </div>
);

export default AppointmentsFilter;
