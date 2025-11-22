'use client';

import ManagementPageHeader from '@/components/shared/ManagementPageHeader';
import { Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import AdminFormDialog from './AdminFormDialog';
import { useRouter } from 'next/navigation';

const AdminsManagementHeader = () => {
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
    setDialogKey((prevKey) => prevKey + 1); // Update key to force remount
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <>
      <AdminFormDialog
        key={dialogKey}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />
      <ManagementPageHeader
        title='Admins Management'
        description='Manage admin accounts and permissions'
        action={{
          label: 'Add Admin',
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
    </>
  );
};

export default AdminsManagementHeader;
