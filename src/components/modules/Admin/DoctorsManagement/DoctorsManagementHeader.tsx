'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import ManagementPageHeader from '@/components/shared/ManagementPageHeader';
import { Plus } from 'lucide-react';
import DoctorFormDialog from './DoctorFormDialog';
import { ISpecialty } from '@/types/specialities.interface';

interface DoctorsManagementHeaderProps {
  specialities?: ISpecialty[];
}

const DoctorsManagementHeader = ({
  specialities,
}: DoctorsManagementHeaderProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const [dialogKey, setDialogKey] = useState(0);

  const handleOpenDialog = () => {
    setDialogKey(dialogKey + 1); // force mount
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <>
      <DoctorFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
        specialities={specialities}
      />

      <ManagementPageHeader
        title='Doctors Management'
        description='Manage Specialties information and details'
        action={{
          label: 'Add Doctor   ',
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default DoctorsManagementHeader;
