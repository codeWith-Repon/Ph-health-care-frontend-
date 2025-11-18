'use client';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import ManagementTable from '@/components/shared/ManagementTable';
import { IDoctor } from '@/types/doctor.interface';
import { doctorsColumns } from './DoctorsColumns';
import { useState, useTransition } from 'react';
import { deleteDoctor } from '@/services/admin/doctorManagement';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DoctorViewDetailDialog from './DoctorViewDetailDialog';
import DoctorFormDialog from './DoctorFormDialog';
import { ISpecialty } from '@/types/specialities.interface';

interface DoctorsTableProps {
  doctors: IDoctor[];
  specialities: ISpecialty[];
}

const DoctorTable = ({ doctors, specialities }: DoctorsTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingDoctor, setDeletingDoctor] = useState<IDoctor | null>(null);
  const [viewDoctor, setViewDoctor] = useState<IDoctor | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<IDoctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (doctor: IDoctor) => {
    setDeletingDoctor(doctor);
  };

  const handleView = (doctor: IDoctor) => {
    setViewDoctor(doctor);
  };

  const handleEdit = (doctor: IDoctor) => {
    setEditingDoctor(doctor);
  };

  const confirmDelete = async () => {
    if (!deletingDoctor) return;

    setIsDeleting(true);
    const result = await deleteDoctor(deletingDoctor.id!);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || 'Doctor deleted successfully');
      setDeletingDoctor(null);
      handleRefresh();
    } else {
      toast.error(result.message || 'Failed to delete doctor');
    }
  };

  return (
    <>
      <ManagementTable
        data={doctors}
        columns={doctorsColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(doctor) => doctor.id!}
        emptyMessage='No doctors found'
      />

      {/* Edit doctor form dialog  */}
      <DoctorFormDialog
        open={!!editingDoctor}
        onClose={() => setEditingDoctor(null)}
        doctor={editingDoctor!}
        specialities={specialities}
        onSuccess={() => {
          setEditingDoctor(null);
          handleRefresh();
        }}
      />

      {/* view doctor detail dialog */}
      <DoctorViewDetailDialog
        open={!!viewDoctor}
        onClose={() => setViewDoctor(null)}
        doctor={viewDoctor}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingDoctor}
        onOpenChange={(open) => !open && setDeletingDoctor(null)}
        onConfirm={confirmDelete}
        title='Delete Doctor'
        description={`Are you sure you want to delete ${deletingDoctor?.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default DoctorTable;
