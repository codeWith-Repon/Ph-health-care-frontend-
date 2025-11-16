import { Column } from '@/components/shared/ManagementTable';
import { ISpecialty } from '@/types/specialities.interface';
import Image from 'next/image';

export const specialitiesColumns: Column<ISpecialty>[] = [
  {
    header: 'Icon',
    accessor: (specialty) => (
      <Image
        src={specialty.icon}
        alt={specialty.title}
        width={40}
        height={40}
        className='rounded-full'
      />
    ),
  },
  {
    header: 'Title',
    accessor: (specialty) => specialty.title,
  },
];
