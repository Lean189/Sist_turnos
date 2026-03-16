"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight,
  Info
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

const services = [
  { id: "1", name: "Consulta General", duration: 30, price: 50 },
  { id: "2", name: "Limpieza Dental", duration: 45, price: 80 },
  { id: "3", name: "Ortodoncia", duration: 60, price: 120 },
];

const staffList = [
  { id: "1", name: "Dr. Juan Pérez", title: "Médico General" },
  { id: "2", name: "Dra. Maria Luz", title: "Odontóloga" },
];

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "16:00"];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState("");

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Reservar Cita</h1>
        <p className="text-muted-foreground mt-2">Sigue los pasos para agendar tu próximo turno.</p>
      </div>

      {/* stepper */}
      <div className="flex items-center justify-center gap-4 py-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
              step >= s ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
            )}>
              {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            {s < 4 && <div className={cn("h-0.5 w-8 rounded-full", step > s ? "bg-primary" : "bg-muted")} />}
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-3xl p-8 shadow-sm relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
              Selecciona un Servicio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => { setSelectedService(service); nextStep(); }}
                  className={cn(
                    "flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all hover:border-primary group",
                    selectedService?.id === service.id ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-muted/30"
                  )}
                >
                  <div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {service.duration} min
                    </p>
                  </div>
                  <div className="text-lg font-extrabold text-foreground">
                    {formatCurrency(service.price)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                ¿Con quién te gustaría atenderte?
              </h2>
              <button 
                onClick={prevStep}
                className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Volver
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button
                  onClick={() => { setSelectedStaff({ id: "any", name: "Cualquier persona" }); nextStep(); }}
                  className={cn(
                    "flex flex-col items-center justify-center p-8 rounded-2xl border-2 text-center transition-all hover:border-primary group",
                    selectedStaff?.id === "any" ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-muted/30"
                  )}
                >
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold">Cualquier persona</h3>
                  <p className="text-xs text-muted-foreground mt-1">Asignación automática</p>
                </button>
              {staffList.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => { setSelectedStaff(staff); nextStep(); }}
                  className={cn(
                    "flex flex-col items-center justify-center p-8 rounded-2xl border-2 text-center transition-all hover:border-primary group",
                    selectedStaff?.id === staff.id ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-muted/30"
                  )}
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                    <span className="text-xl font-bold">{staff.name[0]}</span>
                  </div>
                  <h3 className="font-bold">{staff.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{staff.title}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                Selecciona Fecha y Hora
              </h2>
              <button 
                onClick={prevStep}
                className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Volver
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Fecha</p>
              <div className="flex gap-2 pb-4 overflow-x-auto">
                {days.map((day) => (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[80px] p-4 rounded-2xl border-2 transition-all",
                      isSameDay(selectedDate, day) ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-transparent bg-muted/30 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-[10px] uppercase font-bold opacity-80">{format(day, "eee", { locale: es })}</span>
                    <span className="text-xl font-extrabold">{format(day, "dd")}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Horarios Disponibles</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => { setSelectedTime(time); nextStep(); }}
                    className={cn(
                      "py-3 rounded-xl border-2 text-sm font-bold transition-all hover:border-primary hover:text-primary",
                      selectedTime === time ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-transparent bg-muted/30"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center py-4">
             <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">¡Todo listo para confirmar!</h2>
              <p className="text-muted-foreground italic">Revisa los detalles de tu reserva antes de finalizar.</p>
            </div>

            <div className="max-w-md mx-auto bg-muted/30 rounded-3xl p-8 border space-y-4 text-left">
               <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Servicio</p>
                  <p className="font-bold text-lg">{selectedService?.name}</p>
                   <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {selectedService?.duration} min
                    </p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-muted-foreground uppercase">Precio</p>
                   <p className="font-extrabold text-primary text-lg">{formatCurrency(selectedService?.price)}</p>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Profesional</p>
                    <p className="text-sm font-bold">{selectedStaff?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Fecha y Hora</p>
                    <p className="text-sm font-bold uppercase">{format(selectedDate, "EEEE d 'de' MMMM", { locale: es })} a las {selectedTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                onClick={prevStep}
                className="inline-flex h-12 items-center justify-center rounded-2xl border px-8 text-sm font-bold shadow-sm transition-all hover:bg-accent"
              >
                Modificar
              </button>
              <button 
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-12 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105"
                onClick={() => alert("¡Turno reserva exitosamente!")}
              >
                Confirmar Reserva
              </button>
            </div>
            
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <Info className="h-3 w-3" /> Se enviará un recordatorio por email 24hs antes de tu cita.
            </p>
          </div>
        )}
      </div>

      {selectedService && step < 4 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Resumen de tu elección</p>
              <p className="text-sm font-bold">{selectedService.name} {selectedStaff ? `con ${selectedStaff.name}` : ""} {selectedTime ? `el ${format(selectedDate, "dd/MM")} a las ${selectedTime}` : ""}</p>
            </div>
          </div>
          <p className="font-extrabold text-primary">{formatCurrency(selectedService.price)}</p>
        </div>
      )}
    </div>
  );
}
