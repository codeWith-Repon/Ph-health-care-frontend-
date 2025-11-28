/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ManagementPageHeader from '@/components/shared/ManagementPageHeader';
import { Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import BookScheduleDialog from './BookScheduleDialog';
import { useRouter } from 'next/navigation';

interface MySchedulesHeaderProps {
  availableSchedules: any[];
}

const MyScheduleHeader = ({ availableSchedules }: MySchedulesHeaderProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <>
      <BookScheduleDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
        availableSchedules={availableSchedules}
      />

      <ManagementPageHeader
        title='My Schedule'
        description='Mange your availability and time slots for patient consultation'
        action={{
          label: 'Book Schedule',
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default MyScheduleHeader;
