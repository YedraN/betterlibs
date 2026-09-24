import { createIcon } from './create-icon.tsx'

// Flechas y navegación
export const ArrowRightIcon = createIcon('ArrowRight', ['M5 12h14', 'm13 6 6 6-6 6'])
export const ArrowLeftIcon = createIcon('ArrowLeft', ['M19 12H5', 'm11 18-6-6 6-6'])
export const ArrowUpIcon = createIcon('ArrowUp', ['M12 19V5', 'm6 11 6-6 6 6'])
export const ArrowDownIcon = createIcon('ArrowDown', ['M12 5v14', 'm18 13-6 6-6-6'])
export const ArrowUpRightIcon = createIcon('ArrowUpRight', ['M7 17 17 7', 'M8 7h9v9'])
export const ChevronRightIcon = createIcon('ChevronRight', ['m9 6 6 6-6 6'])
export const ChevronLeftIcon = createIcon('ChevronLeft', ['m15 6-6 6 6 6'])
export const ChevronDownIcon = createIcon('ChevronDown', ['m6 9 6 6 6-6'])
export const ChevronUpIcon = createIcon('ChevronUp', ['m6 15 6-6 6 6'])
export const ExternalLinkIcon = createIcon('ExternalLink', [
  'M14 5h5v5',
  'm19 5-9 9',
  'M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
])
export const MenuIcon = createIcon('Menu', ['M4 7h16', 'M4 12h16', 'M4 17h16'])
export const HomeIcon = createIcon('Home', [
  'm3.5 10.5 8.5-7 8.5 7',
  'M5.5 9v11h13V9',
  'M10 20v-6h4v6',
])

// Acciones
export const CheckIcon = createIcon('Check', ['m5 12.5 4.5 4.5L19 7'])
export const CloseIcon = createIcon('Close', ['m6 6 12 12', 'M18 6 6 18'])
export const PlusIcon = createIcon('Plus', ['M12 5v14', 'M5 12h14'])
export const MinusIcon = createIcon('Minus', ['M5 12h14'])
export const SearchIcon = createIcon('Search', [{ c: [11, 11, 6.5] }, 'm16 16 4 4'])
export const DownloadIcon = createIcon('Download', ['M12 4v11', 'm7 10 5 5 5-5', 'M5 20h14'])
export const UploadIcon = createIcon('Upload', ['M12 16V5', 'm7 10 5-5 5 5', 'M5 20h14'])
export const CopyIcon = createIcon('Copy', [
  { r: [8, 8, 12, 12, 2] },
  'M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2',
])
export const SendIcon = createIcon('Send', ['M21 3 10 14', 'm21 3-6.5 18-4.5-7-7-4.5z'])
export const ShareIcon = createIcon('Share', [
  { c: [18, 5, 2.5] },
  { c: [6, 12, 2.5] },
  { c: [18, 19, 2.5] },
  'm8.2 10.8 7.6-4.4',
  'm8.2 13.2 7.6 4.4',
])
export const FilterIcon = createIcon('Filter', ['M4 5h16l-6 7.5V19l-4 1.5v-8z'])
export const SlidersIcon = createIcon('Sliders', [
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
export const PlayIcon = createIcon('Play', ['M7 4.5v15l12-7.5z'])
export const PauseIcon = createIcon('Pause', ['M8 5v14', 'M16 5v14'])
export const EyeIcon = createIcon('Eye', [
  'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z',
  { c: [12, 12, 3] },
])
export const EyeOffIcon = createIcon('EyeOff', [
  'm3 3 18 18',
  'M10.6 5.6a9.7 9.7 0 0 1 1.4-.1c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.7',
  'M6.6 6.6C4 8.3 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.8 0 3.4-.6 4.7-1.4',
  'M9.9 9.9a3 3 0 0 0 4.2 4.2',
])

// Contacto y ubicación
export const MailIcon = createIcon('Mail', [{ r: [3, 5, 18, 14, 2] }, 'm3.5 6.5 8.5 6 8.5-6'])
export const PhoneIcon = createIcon('Phone', [
  'M21 16.4v3a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.2 19.2 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.5A2 2 0 0 1 3.4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L7.4 9.8a16 16 0 0 0 5.9 5.9l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.6 1.8z',
])
export const MapPinIcon = createIcon('MapPin', [
  'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z',
  { c: [12, 9.5, 2.5] },
])
export const GlobeIcon = createIcon('Globe', [
  { c: [12, 12, 9] },
  'M3 12h18',
  'M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z',
])
export const MessageIcon = createIcon('Message', [
  'M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z',
])
export const CalendarIcon = createIcon('Calendar', [
  { r: [3.5, 5, 17, 15.5, 2] },
  'M3.5 10h17',
  'M8 3v4',
  'M16 3v4',
])
export const ClockIcon = createIcon('Clock', [{ c: [12, 12, 9] }, 'M12 7v5l3 2'])

// Personas y organización
export const UserIcon = createIcon('User', [{ c: [12, 8, 4] }, 'M4 20.5c1.5-4 4.5-6 8-6s6.5 2 8 6'])
export const UsersIcon = createIcon('Users', [
  { c: [9, 8, 3.5] },
  'M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5',
  'M16 4.6a3.5 3.5 0 0 1 0 6.8',
  'M18 14.8c1.8.7 3 2.5 3.5 5.2',
])
export const BuildingIcon = createIcon('Building', [
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
export const BriefcaseIcon = createIcon('Briefcase', [
  { r: [3, 7, 18, 13, 2] },
  'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  'M3 13h18',
])
export const AwardIcon = createIcon('Award', [{ c: [12, 9, 6] }, 'M8.5 14 7 21.5l5-3 5 3-1.5-7.5'])
export const TargetIcon = createIcon('Target', [
  { c: [12, 12, 9] },
  { c: [12, 12, 5] },
  { c: [12, 12, 1] },
])

// Estados y feedback
export const InfoIcon = createIcon('Info', [{ c: [12, 12, 9] }, 'M12 11v5', 'M12 8h.01'])
export const AlertCircleIcon = createIcon('AlertCircle', [
  { c: [12, 12, 9] },
  'M12 7.5v5',
  'M12 16h.01',
])
export const AlertTriangleIcon = createIcon('AlertTriangle', [
  'M10.3 4.2 2.6 17.5a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z',
  'M12 9.5v4',
  'M12 17h.01',
])
export const CheckCircleIcon = createIcon('CheckCircle', [
  { c: [12, 12, 9] },
  'm8.5 12.5 2.5 2.5 4.5-5',
])
export const XCircleIcon = createIcon('XCircle', [{ c: [12, 12, 9] }, 'm9 9 6 6', 'm15 9-6 6'])
export const LockIcon = createIcon('Lock', [
  { r: [4.5, 10.5, 15, 10, 2] },
  'M8 10.5V7a4 4 0 0 1 8 0v3.5',
])
export const ShieldCheckIcon = createIcon('ShieldCheck', [
  'M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z',
  'm9 12 2 2 4-4',
])

// Contenido y negocio
export const StarIcon = createIcon('Star', [
  'm12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
])
export const HeartIcon = createIcon('Heart', [
  'M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z',
])
export const QuoteIcon = createIcon('Quote', [
  'M10 11H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5c0 3-1.5 5-4 6',
  'M19 11h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5c0 3-1.5 5-4 6',
])
export const FileTextIcon = createIcon('FileText', [
  'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z',
  'M14 3v5h5',
  'M9 13h6',
  'M9 17h6',
])
export const ZapIcon = createIcon('Zap', ['M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z'])
export const TrendingUpIcon = createIcon('TrendingUp', ['m3 17 6-6 4 4 8-8', 'M15 7h6v6'])
export const BarChartIcon = createIcon('BarChart', ['M4 20h16', 'M7 16v-4', 'M12 16V7', 'M17 16V9'])
export const LayoutGridIcon = createIcon('LayoutGrid', [
  { r: [4, 4, 7, 7, 1.5] },
  { r: [13, 4, 7, 7, 1.5] },
  { r: [4, 13, 7, 7, 1.5] },
  { r: [13, 13, 7, 7, 1.5] },
])

// Interfaz
export const SunIcon = createIcon('Sun', [
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
export const MoonIcon = createIcon('Moon', ['M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z'])
