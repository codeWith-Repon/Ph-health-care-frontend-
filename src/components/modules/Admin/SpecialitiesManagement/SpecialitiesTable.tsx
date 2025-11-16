'use client';

import ManagementTable from '@/components/shared/ManagementTable';
import { ISpecialty } from '@/types/specialities.interface';
import { specialitiesColumns } from './specialitiesColumns';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteSpecialty } from '@/services/admin/specialtiesManagement';
import { toast } from 'sonner';

interface SpecialtyTableProps {
  specialities: ISpecialty[];
}
const SpecialitiesTable = ({ specialities }: SpecialtyTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingSpecialty, setDeletingSpecialty] = useState<ISpecialty | null>(
    null
  );
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (specialty: ISpecialty) => {
    setDeletingSpecialty(specialty);
  };

  const confirmDelete = async () => {
    if (!deletingSpecialty) return;

    setIsDeletingDialog(true);
    const result = await deleteSpecialty(deletingSpecialty.id);
    setIsDeletingDialog(false);

    if (result.success) {
      toast.success(result.message || 'Specialty deleted successfully');
      setDeletingSpecialty(null);
      handleRefresh();
    } else {
      if (result.message === 'Foreign key constraint failed') {
        toast.error('Specialty is in use and cannot be deleted');
      } else {
        toast.error(result.message || 'Failed to delete specialty');
      }
    }
  };

  return (
    <>
      <ManagementTable
        data={specialities}
        columns={specialitiesColumns}
        onDelete={handleDelete}
        getRowKey={(specialty) => specialty.id}
        emptyMessage='No specialities found'
      />

      <DeleteConfirmationDialog
        open={!!deletingSpecialty}
        onOpenChange={(open) => !open && setDeletingSpecialty(null)}
        onConfirm={confirmDelete}
        title='Delete Specialty'
        description={`Are you sure you want to delete ${deletingSpecialty?.title}? This action cannot be undone.`}
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default SpecialitiesTable;
