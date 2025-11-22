'use client';
import ManagementTable from '@/components/shared/ManagementTable';
import { IAdmin } from '@/types/admin.interface';
import { adminsColumn } from './AdminsColumn';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import AdminFormDialog from './AdminFormDialog';
import AdminViewDetailDialog from './AdminViewDetailDialog';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { softDeleteAdmin } from '@/services/admin/adminsManagement';
import { toast } from 'sonner';

interface AdminsTableProps {
  admins: IAdmin[];
}

const AdminsTable = ({ admins }: AdminsTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingAdmin, setDeletingAdmin] = useState<IAdmin | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<IAdmin | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<IAdmin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (admin: IAdmin) => {
    setViewingAdmin(admin);
  };
  const handleEdit = (admin: IAdmin) => {
    setEditingAdmin(admin);
  };

  const handleDelete = (admin: IAdmin) => {
    setDeletingAdmin(admin);
  };

  const confirmDelete = async () => {
    if (!deletingAdmin) return;

    setIsDeleting(true);
    const result = await softDeleteAdmin(deletingAdmin.id!);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || 'Admin deleted successfully');
      setDeletingAdmin(null);
      handleRefresh();
    } else {
      toast.error(result.message || 'Failed to delete admin');
    }
  };

  return (
    <>
      <ManagementTable
        data={admins}
        columns={adminsColumn}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(admin) => admin.id!}
        emptyMessage='No admins found'
      />

      {/* edit Admin form */}
      <AdminFormDialog
        open={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        admin={editingAdmin!}
        onSuccess={() => {
          setEditingAdmin(null);
          handleRefresh();
        }}
      />

      {/* view admin details dialog */}
      <AdminViewDetailDialog
        open={!!viewingAdmin}
        onClose={() => setViewingAdmin(null)}
        admin={viewingAdmin!}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={!!deletingAdmin}
        onOpenChange={(open) => !open && setDeletingAdmin(null)}
        onConfirm={confirmDelete}
        title='Delete Admin'
        description={`Are you sure you want to delete admin "${deletingAdmin?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default AdminsTable;
