# 💇 Peluquería M&O — Sistema de turnos online

Aplicación web completa para una peluquería real: las clientas reservan turnos
online, la dueña administra su agenda desde un panel privado y confirma cada
turno por WhatsApp con un click. Incluye una tienda de productos y un
probador de looks con IA.

> 🛠️ Proyecto en producción, usado a diario por un negocio real.

<!-- Cuando esté deployado, completá estos links:
🔗 **Demo:** https://peluqueria-mo.vercel.app
-->

## ✨ Funcionalidades

**Para las clientas**
- 📅 Reserva de turnos en 3 pasos: día → horario → datos (los horarios ocupados se bloquean en tiempo real)
- 🛍️ Catálogo de productos con promos y filtros por categoría
- 🤖 Probador de looks con IA: subís una foto, describís el corte/color y la IA genera el resultado (Replicate / Flux)
- 📲 Aviso por WhatsApp y botón para agendar el turno en Google Calendar

**Para la administradora**
- 🔐 Panel privado con login (JWT)
- 🗓️ Agenda en lista y calendario semanal, con búsqueda y filtros
- ✅ Confirmación de turnos por WhatsApp con mensaje pre-escrito (un click)
- 🚫 Bloqueo de horarios (vacaciones, trámites, almuerzo)
- ✂️ ABM de servicios y productos, configuración de horarios y días de atención

## 🧰 Stack

| Capa | Tecnologías |
|---|---|
| Frontend | React 18 · Vite · Tailwind CSS · Framer Motion · React Router |
| Backend | Node.js · Express · JWT |
| Base de datos | MongoDB Atlas (Mongoose) |
| IA | Replicate (flux-kontext change-haircut) |
| Hosting | Vercel (frontend estático + backend serverless) |

## 🔒 Seguridad

- Rutas de escritura protegidas con JWT; el endpoint público de turnos
  nunca expone datos personales de clientes (solo horarios ocupados)
- La duración y el precio de los servicios se validan contra la base,
  no se confía en datos del cliente
- Rate limit por IP en la ruta de IA (sin confiar en headers falsificables)
- CORS restringido por entorno, secretos fuera del repo (`.env` + `.env.example`)

## 🚀 Correrlo en local

```bash
# Backend
cd back
cp .env.example .env   # completar credenciales
npm install
npm run dev            # http://localhost:5000

# Frontend (en otra terminal)
cd front
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

## 📁 Estructura

```
├── back/          # API Express (serverless-ready para Vercel)
│   ├── models/    # Esquemas de Mongoose (Booking, Service, Product, Settings)
│   ├── routes/    # Endpoints REST (+ auth middleware)
│   └── services/  # Email de confirmación (opcional)
└── front/         # SPA React + Vite + Tailwind
    └── src/
        ├── pages/       # Home, Turnos, Tienda, IA, Admin, Login
        ├── components/  # BookingModal, WeeklyCalendar, etc.
        └── utils/       # API client, links de WhatsApp
```
