// Links de WhatsApp para que la peluquera confirme turnos a sus clientas
// con el mensaje ya escrito — solo queda tocar "enviar".

// Normaliza un teléfono argentino escrito de cualquier manera al formato
// internacional que exige wa.me (549 + área + número, sin "+" ni espacios).
function normalizeArPhone(raw) {
    let d = String(raw || '').replace(/\D/g, '');
    d = d.replace(/^0+/, ''); // "02337..." → "2337..."
    // "2337 15 455666" → sacamos el 15 viejo de celular (área de 2-4 dígitos + 15 + número)
    d = d.replace(/^(\d{2,4})15(\d{6,8})$/, '$1$2');
    if (d.startsWith('549')) return d;
    if (d.startsWith('54')) return '549' + d.slice(2);
    return '549' + d;
}

// Recibe un turno ({ clientName, clientPhone, serviceName, dateStr, time })
// y devuelve el link wa.me con la confirmación pre-escrita.
export function clientWhatsAppUrl(booking) {
    const phone = normalizeArPhone(booking.clientPhone);
    const fecha = booking.dateStr
        ? new Date(booking.dateStr + 'T12:00:00').toLocaleDateString('es-AR', {
            weekday: 'long', day: 'numeric', month: 'long'
        })
        : '';
    const msg = `¡Hola ${booking.clientName}! 💇 Te confirmo tu turno de *${booking.serviceName}* en M&O Estilistas:\n\n📅 ${fecha}\n⏰ ${booking.time} hs\n\nSi surge algún problema o necesitás cancelar, avisame por acá con tiempo. ¡Te espero!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
