import DoctorPrescriptionsTable from '@/components/modules/Doctor/DoctorPrescription/DoctorPrescriptionTable';
import { getMyAppointments } from '@/services/patient/appointment.service';
import { IAppointment } from '@/types/appointments.interface';
import { IPrescription } from '@/types/prescription.interface';

export default async function DoctorPrescriptionsPage() {
  // Get all doctor's appointments
  const response = await getMyAppointments();
  const appointments: IAppointment[] = response?.data || [];

  const prescriptions: IPrescription[] = appointments
    .filter((appointment) => appointment.prescription)
    .map((appointment) => ({
      ...appointment.prescription!,
      patient: appointment.patient,
      appointment,
    }));

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>My Prescriptions</h1>
        <p className='text-muted-foreground mt-2'>
          View all prescriptions you have provided to patients
        </p>
      </div>

      <DoctorPrescriptionsTable prescriptions={prescriptions} />
    </div>
  );
}
