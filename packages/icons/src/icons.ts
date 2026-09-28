import { createIcon } from './create-icon.tsx'

// Flechas y navegación
export const ArrowRightIcon = /* @__PURE__ */ createIcon('ArrowRight', [
  'M5 12h14',
  'm13 6 6 6-6 6',
])
export const ArrowLeftIcon = /* @__PURE__ */ createIcon('ArrowLeft', ['M19 12H5', 'm11 18-6-6 6-6'])
export const ArrowUpIcon = /* @__PURE__ */ createIcon('ArrowUp', ['M12 19V5', 'm6 11 6-6 6 6'])
export const ArrowDownIcon = /* @__PURE__ */ createIcon('ArrowDown', ['M12 5v14', 'm18 13-6 6-6-6'])
export const ArrowUpRightIcon = /* @__PURE__ */ createIcon('ArrowUpRight', [
  'M7 17 17 7',
  'M8 7h9v9',
])
export const ChevronRightIcon = /* @__PURE__ */ createIcon('ChevronRight', ['m9 6 6 6-6 6'])
export const ChevronLeftIcon = /* @__PURE__ */ createIcon('ChevronLeft', ['m15 6-6 6 6 6'])
export const ChevronDownIcon = /* @__PURE__ */ createIcon('ChevronDown', ['m6 9 6 6 6-6'])
export const ChevronUpIcon = /* @__PURE__ */ createIcon('ChevronUp', ['m6 15 6-6 6 6'])
export const ExternalLinkIcon = /* @__PURE__ */ createIcon('ExternalLink', [
  'M14 5h5v5',
  'm19 5-9 9',
  'M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
])
export const MenuIcon = /* @__PURE__ */ createIcon('Menu', ['M4 7h16', 'M4 12h16', 'M4 17h16'])
export const HomeIcon = /* @__PURE__ */ createIcon('Home', [
  'm3.5 10.5 8.5-7 8.5 7',
  'M5.5 9v11h13V9',
  'M10 20v-6h4v6',
])

// Acciones
export const CheckIcon = /* @__PURE__ */ createIcon('Check', ['m5 12.5 4.5 4.5L19 7'])
export const CloseIcon = /* @__PURE__ */ createIcon('Close', ['m6 6 12 12', 'M18 6 6 18'])
export const PlusIcon = /* @__PURE__ */ createIcon('Plus', ['M12 5v14', 'M5 12h14'])
export const MinusIcon = /* @__PURE__ */ createIcon('Minus', ['M5 12h14'])
export const SearchIcon = /* @__PURE__ */ createIcon('Search', [{ c: [11, 11, 6.5] }, 'm16 16 4 4'])
export const DownloadIcon = /* @__PURE__ */ createIcon('Download', [
  'M12 4v11',
  'm7 10 5 5 5-5',
  'M5 20h14',
])
export const UploadIcon = /* @__PURE__ */ createIcon('Upload', [
  'M12 16V5',
  'm7 10 5-5 5 5',
  'M5 20h14',
])
export const CopyIcon = /* @__PURE__ */ createIcon('Copy', [
  { r: [8, 8, 12, 12, 2] },
  'M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2',
])
export const SendIcon = /* @__PURE__ */ createIcon('Send', [
  'M21 3 10 14',
  'm21 3-6.5 18-4.5-7-7-4.5z',
])
export const ShareIcon = /* @__PURE__ */ createIcon('Share', [
  { c: [18, 5, 2.5] },
  { c: [6, 12, 2.5] },
  { c: [18, 19, 2.5] },
  'm8.2 10.8 7.6-4.4',
  'm8.2 13.2 7.6 4.4',
])
export const FilterIcon = /* @__PURE__ */ createIcon('Filter', ['M4 5h16l-6 7.5V19l-4 1.5v-8z'])
export const SlidersIcon = /* @__PURE__ */ createIcon('Sliders', [
  'M4 6h9',
  'M17 6h3',
  { c: [15, 6, 2] },
  'M4 12h3',
  'M11 12h9',
  { c: [9, 12, 2] },
  'M4 18h11',
  'M19 18h1',
  { c: [17, 18, 2] },
])
export const PlayIcon = /* @__PURE__ */ createIcon('Play', ['M7 4.5v15l12-7.5z'])
export const PauseIcon = /* @__PURE__ */ createIcon('Pause', ['M8 5v14', 'M16 5v14'])
export const EyeIcon = /* @__PURE__ */ createIcon('Eye', [
  'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z',
  { c: [12, 12, 3] },
])
export const EyeOffIcon = /* @__PURE__ */ createIcon('EyeOff', [
  'm3 3 18 18',
  'M10.6 5.6a9.7 9.7 0 0 1 1.4-.1c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.7',
  'M6.6 6.6C4 8.3 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.8 0 3.4-.6 4.7-1.4',
  'M9.9 9.9a3 3 0 0 0 4.2 4.2',
])

// Contacto y ubicación
export const MailIcon = /* @__PURE__ */ createIcon('Mail', [
  { r: [3, 5, 18, 14, 2] },
  'm3.5 6.5 8.5 6 8.5-6',
])
export const PhoneIcon = /* @__PURE__ */ createIcon('Phone', [
  'M21 16.4v3a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.2 19.2 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.5A2 2 0 0 1 3.4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L7.4 9.8a16 16 0 0 0 5.9 5.9l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.6 1.8z',
])
export const MapPinIcon = /* @__PURE__ */ createIcon('MapPin', [
  'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z',
  { c: [12, 9.5, 2.5] },
])
export const GlobeIcon = /* @__PURE__ */ createIcon('Globe', [
  { c: [12, 12, 9] },
  'M3 12h18',
  'M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z',
])
export const MessageIcon = /* @__PURE__ */ createIcon('Message', [
  'M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z',
])
export const CalendarIcon = /* @__PURE__ */ createIcon('Calendar', [
  { r: [3.5, 5, 17, 15.5, 2] },
  'M3.5 10h17',
  'M8 3v4',
  'M16 3v4',
])
export const ClockIcon = /* @__PURE__ */ createIcon('Clock', [{ c: [12, 12, 9] }, 'M12 7v5l3 2'])

// Personas y organización
export const UserIcon = /* @__PURE__ */ createIcon('User', [
  { c: [12, 8, 4] },
  'M4 20.5c1.5-4 4.5-6 8-6s6.5 2 8 6',
])
export const UsersIcon = /* @__PURE__ */ createIcon('Users', [
  { c: [9, 8, 3.5] },
  'M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5',
  'M16 4.6a3.5 3.5 0 0 1 0 6.8',
  'M18 14.8c1.8.7 3 2.5 3.5 5.2',
])
export const BuildingIcon = /* @__PURE__ */ createIcon('Building', [
  { r: [4, 3, 12, 18, 1] },
  'M16 9h3a1 1 0 0 1 1 1v11',
  'M8 7h1',
  'M11 7h1',
  'M8 11h1',
  'M11 11h1',
  'M8 15h1',
  'M11 15h1',
  'M2 21h20',
])
export const BriefcaseIcon = /* @__PURE__ */ createIcon('Briefcase', [
  { r: [3, 7, 18, 13, 2] },
  'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  'M3 13h18',
])
export const AwardIcon = /* @__PURE__ */ createIcon('Award', [
  { c: [12, 9, 6] },
  'M8.5 14 7 21.5l5-3 5 3-1.5-7.5',
])
export const TargetIcon = /* @__PURE__ */ createIcon('Target', [
  { c: [12, 12, 9] },
  { c: [12, 12, 5] },
  { c: [12, 12, 1] },
])

// Estados y feedback
export const InfoIcon = /* @__PURE__ */ createIcon('Info', [
  { c: [12, 12, 9] },
  'M12 11v5',
  'M12 8h.01',
])
export const AlertCircleIcon = /* @__PURE__ */ createIcon('AlertCircle', [
  { c: [12, 12, 9] },
  'M12 7.5v5',
  'M12 16h.01',
])
export const AlertTriangleIcon = /* @__PURE__ */ createIcon('AlertTriangle', [
  'M10.3 4.2 2.6 17.5a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z',
  'M12 9.5v4',
  'M12 17h.01',
])
export const CheckCircleIcon = /* @__PURE__ */ createIcon('CheckCircle', [
  { c: [12, 12, 9] },
  'm8.5 12.5 2.5 2.5 4.5-5',
])
export const XCircleIcon = /* @__PURE__ */ createIcon('XCircle', [
  { c: [12, 12, 9] },
  'm9 9 6 6',
  'm15 9-6 6',
])
export const LockIcon = /* @__PURE__ */ createIcon('Lock', [
  { r: [4.5, 10.5, 15, 10, 2] },
  'M8 10.5V7a4 4 0 0 1 8 0v3.5',
])
export const ShieldCheckIcon = /* @__PURE__ */ createIcon('ShieldCheck', [
  'M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z',
  'm9 12 2 2 4-4',
])

// Contenido y negocio
export const StarIcon = /* @__PURE__ */ createIcon('Star', [
  'm12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
])
export const HeartIcon = /* @__PURE__ */ createIcon('Heart', [
  'M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z',
])
export const QuoteIcon = /* @__PURE__ */ createIcon('Quote', [
  'M10 11H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5c0 3-1.5 5-4 6',
  'M19 11h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5c0 3-1.5 5-4 6',
])
export const FileTextIcon = /* @__PURE__ */ createIcon('FileText', [
  'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z',
  'M14 3v5h5',
  'M9 13h6',
  'M9 17h6',
])
export const ZapIcon = /* @__PURE__ */ createIcon('Zap', ['M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z'])
export const TrendingUpIcon = /* @__PURE__ */ createIcon('TrendingUp', [
  'm3 17 6-6 4 4 8-8',
  'M15 7h6v6',
])
export const BarChartIcon = /* @__PURE__ */ createIcon('BarChart', [
  'M4 20h16',
  'M7 16v-4',
  'M12 16V7',
  'M17 16V9',
])
export const LayoutGridIcon = /* @__PURE__ */ createIcon('LayoutGrid', [
  { r: [4, 4, 7, 7, 1.5] },
  { r: [13, 4, 7, 7, 1.5] },
  { r: [4, 13, 7, 7, 1.5] },
  { r: [13, 13, 7, 7, 1.5] },
])

// Interfaz
export const SunIcon = /* @__PURE__ */ createIcon('Sun', [
  { c: [12, 12, 4] },
  'M12 2v2',
  'M12 20v2',
  'm4.9 4.9 1.4 1.4',
  'm17.7 17.7 1.4 1.4',
  'M2 12h2',
  'M20 12h2',
  'm4.9 19.1 1.4-1.4',
  'm17.7 6.3 1.4-1.4',
])
export const MoonIcon = /* @__PURE__ */ createIcon('Moon', [
  'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z',
])

// Redes sociales (versión de trazo, coherente con el resto del paquete)
export const LinkedInIcon = /* @__PURE__ */ createIcon('LinkedIn', [
  { r: [3, 3, 18, 18, 3] },
  'M8 11v5',
  'M8 8v.01',
  'M12 16v-5',
  'M16 16v-3a2 2 0 0 0-4 0',
])
export const XIcon = /* @__PURE__ */ createIcon('X', [
  'M4 4h4.5L20 20h-4.5z',
  'm4 20 6.7-6.7',
  'M13.3 10.7 20 4',
])
export const InstagramIcon = /* @__PURE__ */ createIcon('Instagram', [
  { r: [3, 3, 18, 18, 5] },
  { c: [12, 12, 4] },
  'M17.5 6.5v.01',
])
export const FacebookIcon = /* @__PURE__ */ createIcon('Facebook', [
  'M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2z',
])
export const YouTubeIcon = /* @__PURE__ */ createIcon('YouTube', [
  'M2.5 8.5A4 4 0 0 1 6.3 4.6C8 4.5 10 4.4 12 4.4s4 .1 5.7.2a4 4 0 0 1 3.8 3.9 44 44 0 0 1 0 7 4 4 0 0 1-3.8 3.9c-1.7.1-3.7.2-5.7.2s-4-.1-5.7-.2a4 4 0 0 1-3.8-3.9 44 44 0 0 1 0-7z',
  'm10 9 5 3-5 3z',
])
export const GitHubIcon = /* @__PURE__ */ createIcon('GitHub', [
  'M9 19c-3.5 1-4-1.5-5.5-2',
  'M15 21v-3.2a2.8 2.8 0 0 0-.8-2.2c2.7-.3 5.3-1.3 5.3-5.8a4.5 4.5 0 0 0-1.2-3.1 4.2 4.2 0 0 0-.1-3.1s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6 0C6.4 3.3 5.4 3.6 5.4 3.6a4.2 4.2 0 0 0-.1 3.1A4.5 4.5 0 0 0 4 9.8c0 4.5 2.6 5.5 5.3 5.8a2.8 2.8 0 0 0-.8 2.2V21',
])
