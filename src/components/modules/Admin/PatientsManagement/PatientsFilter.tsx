import ClearFiltersButton from '@/components/shared/ClearFiltersButton';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';

const PatientsFilter = () => {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-3'>
        {/* row 1. search and refresh */}
        <SearchFilter paramName='searchTerm' placeholder='Search patients...' />
        <RefreshButton />
      </div>

      {/* row 2. filter controls */}
      <div className='flex items-center gap-3'>
        {/* email filter  */}
        <SearchFilter paramName='email' placeholder='Email' />

        {/* contact number filter  */}
        <SearchFilter paramName='contactNumber' placeholder='Contact Number' />

        {/* clear all filters */}
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default PatientsFilter;
