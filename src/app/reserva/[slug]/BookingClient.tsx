"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Info,
  Loader2,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import Link from "next/link";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { fetchAvailableSlots, createAppointment } from "@/app/actions/appointments";

interface BookingClientProps {
  business: any;
}

type Step = "service" | "staff" | "date" | "confirm" | "success";

export default function BookingClient({ business }: BookingClientProps) {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    notes: ""
  });

  const loadSlots = useCallback(async () => {
    if (!selectedStaff || !selectedService) return;
    setIsLoadingSlots(true);
    const result = await fetchAvailableSlots(selectedStaff.id, selectedService.id, selectedDate);
    if (result.success) {
      setSlots(result.slots || []);
    }
    setIsLoadingSlots(false);
  }, [selectedStaff, selectedService, selectedDate]);

  // Cargar slots cuando cambia la fecha o el staff
  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleBooking = async () => {
    if (!selectedSlot || !contactInfo.name || !contactInfo.email) return;

    startTransition(async () => {
      const result = await createAppointment({
        businessId: business.id,
        staffId: selectedStaff.id,
        serviceId: selectedService.id,
        clientId: "temp-guest-id", 
        startTime: selectedSlot.startTime,
        notes: contactInfo.notes
      });

      if (result.success) {
        setStep("success");
      } else {
        alert(result.error);
      }
    });
  };

  const renderHeader = () => (
    <div className="bg-white border-b px-6 py-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {business.logo ? (
          <img src={business.logo} alt={business.name} className="h-12 w-12 rounded-2xl object-cover shadow-sm" />
        ) : (
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
            {business.name[0]}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">{business.name}</h1>
          <p className="text-sm text-muted-foreground font-medium">Reserva tu turno online</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-2xl border border-muted-foreground/10">
        <Info className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pago en el local</span>
      </div>
    </div>
  );

  const renderStepIndicator = () => {
    const steps: { key: Step; label: string }[] = [
      { key: "service", label: "Servicio" },
      { key: "staff", label: "Profesional" },
      { key: "date", label: "Horario" },
      { key: "confirm", label: "Contacto" }
    ];

    if (step === "success") return null;

    return (
      <div className="flex items-center justify-center gap-2 py-6 px-4">
        {steps.map((s, i) => {
          const isActive = step === s.key;
          const isCompleted = steps.findIndex(x => x.key === step) > i;
          
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
                isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : 
                isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-bold uppercase tracking-widest hidden sm:block",
                isActive ? "text-primary" : "text-muted-foreground/60"
              )}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className="h-px w-4 bg-muted mx-2" />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen lg:px-6 lg:py-12 flex flex-col">
      <div className="bg-background lg:rounded-[32px] overflow-hidden lg:shadow-2xl lg:shadow-black/5 border lg:border-muted flex-1 flex flex-col">
        {renderHeader()}
        {renderStepIndicator()}

        <div className="flex-1 p-6 lg:p-10 relative">
          
          {/* PASO 1: SELECCION DE SERVICIO */}
          {step === "service" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-6">Elige un servicio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.services.map((service: any) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep("staff");
                    }}
                    className="flex flex-col p-6 rounded-[24px] border border-muted bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group text-left"
                  >
                    <div className="flex items-start justify-between w-full mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <Clock className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary">${service.price || '0'}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase">{service.duration} min</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{service.description || 'Sin descripción disponible.'}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: SELECCION DE STAFF */}
          {step === "staff" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button 
                onClick={() => setStep("service")}
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-6 group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a servicios
              </button>
              <h2 className="text-2xl font-black mb-6">Elige quién te atenderá</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.staff.filter((s: any) => s.services.some((ser: any) => ser.id === selectedService.id)).map((staff: any) => (
                  <button
                    key={staff.id}
                    onClick={() => {
                      setSelectedStaff(staff);
                      setStep("date");
                    }}
                    className="flex items-center p-4 rounded-[24px] border border-muted bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group text-left"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-muted overflow-hidden border-2 border-white shadow-sm mr-4">
                      {staff.user.image ? (
                        <img src={staff.user.image} alt={staff.user.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary text-white font-black text-xl">
                          {staff.user.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{staff.user.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{staff.title || 'Profesional'}</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: FECHA Y HORA */}
          {step === "date" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <button 
                onClick={() => setStep("staff")}
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-6 group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a profesional
              </button>
              <h2 className="text-2xl font-black mb-6">Elige fecha y hora</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Calendario Simplificado */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Próximos días</p>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                      const d = addDays(new Date(), i);
                      const isSelected = isSameDay(d, selectedDate);
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(startOfDay(d))}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all",
                            isSelected ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" : 
                            "bg-white hover:border-primary/50 text-foreground"
                          )}
                        >
                          <span className="text-[10px] uppercase font-black opacity-60 mb-1">
                            {format(d, "EEE", { locale: es })}
                          </span>
                          <span className="text-lg font-black tracking-tight">
                            {format(d, "dd")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots */}
                <div className="space-y-4">
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Horarios disponibles
                  </p>
                  {isLoadingSlots ? (
                    <div className="h-48 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {slots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setStep("confirm");
                          }}
                          className="py-3 px-4 rounded-xl border border-muted bg-white hover:border-primary hover:text-primary hover:font-bold transition-all text-sm font-medium"
                        >
                          {slot.displayTime}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center bg-muted/30 rounded-[32px] border border-dashed border-muted-foreground/20 p-6 text-center">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
                      <p className="text-sm font-bold text-muted-foreground">No hay turnos para hoy</p>
                      <p className="text-xs text-muted-foreground mt-1">Prueba con otra fecha</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: CONFIRMACION Y CONTACTO */}
          {step === "confirm" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-lg mx-auto">
               <button 
                onClick={() => setStep("date")}
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-6 group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a horario
              </button>
              
              <div className="bg-primary/5 rounded-[32px] p-8 mb-8 border border-primary/10">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Resumen de tu turno</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Fecha y Hora</p>
                      <p className="text-sm font-black uppercase">
                        {format(selectedDate, "eeee dd 'de' MMMM", { locale: es })} - {selectedSlot?.displayTime} hs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Servicio y Staff</p>
                      <p className="text-sm font-black uppercase">
                        {selectedService.name} con {selectedStaff.user.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold ml-1">Tu nombre</label>
                  <input
                    className="w-full px-5 py-3.5 bg-muted/30 border border-muted rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-hidden focus:border-primary text-sm font-medium"
                    placeholder="Ej: Laura González"
                    value={contactInfo.name}
                    onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold ml-1">Email de confirmación</label>
                  <input
                    type="email"
                    className="w-full px-5 py-3.5 bg-muted/30 border border-muted rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-hidden focus:border-primary text-sm font-medium"
                    placeholder="laura@ejemplo.com"
                    value={contactInfo.email}
                    onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold ml-1">Notas especiales (Opcional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-5 py-3.5 bg-muted/30 border border-muted rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-hidden focus:border-primary text-sm font-medium"
                    placeholder="¿Algo que debamos saber?"
                    value={contactInfo.notes}
                    onChange={e => setContactInfo({ ...contactInfo, notes: e.target.value })}
                  />
                </div>
              </div>

              <button
                disabled={isPending || !contactInfo.name || !contactInfo.email}
                onClick={handleBooking}
                className="w-full mt-8 bg-primary text-primary-foreground h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Confirmar Reserva"}
              </button>
            </div>
          )}

          {/* PASO FINAL: EXITO */}
          {step === "success" && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 animate-in zoom-in-95 duration-500">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                <CheckCircle2 className="h-16 w-16 text-primary animate-bounce-short" />
              </div>
              <h2 className="text-4xl font-black tracking-tight mb-4">¡Reserva Exitosa!</h2>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                Hemos agendado tu turno correctamente. Recibirás un correo con todos los detalles. ¡Te esperamos!
              </p>
              <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
                 <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Hacer otra reserva
                </button>
                <Link 
                  href="/"
                  className="w-full h-14 flex items-center justify-center font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-center py-8 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">
        Powered by TurnosPro SaaS
      </p>
    </div>
  );
}
