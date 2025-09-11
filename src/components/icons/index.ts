// src/components/icons/index.ts - Centralized Icon System for HeroUI
import {
    // Navigation & UI
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowTopRightOnSquareIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon,
    
    // User & Auth
    UserIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    ArrowLeftOnRectangleIcon,
    LockClosedIcon,
    KeyIcon,
    EyeIcon,
    EyeSlashIcon,
    
    // Communication
    EnvelopeIcon,
    ChatBubbleLeftRightIcon,
    PhoneIcon,
    PaperAirplaneIcon,
    
    // Business & Finance
    ChartBarIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    CreditCardIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    
    // Security & Trust
    ShieldCheckIcon,
    ShieldExclamationIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    
    // Technology & Devices
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    DeviceTabletIcon,
    WifiIcon,
    ServerIcon,
    CpuChipIcon,
    
    // Content & Media
    DocumentTextIcon,
    DocumentIcon,
    PhotoIcon,
    VideoCameraIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    
    // Actions & Tools
    MagnifyingGlassIcon,
    FunnelIcon,
    Cog6ToothIcon,
    WrenchScrewdriverIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MinusIcon,
    
    // Status & Feedback
    InformationCircleIcon,
    ExclamationCircleIcon,
    CheckIcon,
    ClockIcon,
    CalendarIcon,
    StarIcon,
    HeartIcon,
    GiftIcon,
    
    // Social & Community
    UsersIcon,
    UserGroupIcon,
    ShareIcon,
    LinkIcon,
    GlobeAltIcon,
    
    // Miscellaneous
    HomeIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    BuildingStorefrontIcon,
    SparklesIcon,
    TrophyIcon,
    BoltIcon,
    FireIcon,
    SunIcon,
    MoonIcon,
    CloudIcon,
    CloudArrowUpIcon,
    CloudArrowDownIcon,
    CircleStackIcon,
    TagIcon,
    BookmarkIcon,
    FlagIcon,
    BellIcon,
    BellSlashIcon,
    MegaphoneIcon,
    MicrophoneIcon,
    CameraIcon,
    PlayIcon,
    PauseIcon,
    StopIcon,
    ForwardIcon,
    BackwardIcon,

  } from '@heroicons/react/24/outline'
  
  // Icon mapping for easy access
  export const Icons = {
    // Navigation & UI
    menu: Bars3Icon,
    close: XMarkIcon,
    chevronDown: ChevronDownIcon,
    chevronUp: ChevronUpIcon,
    chevronLeft: ChevronLeftIcon,
    chevronRight: ChevronRightIcon,
    arrowRight: ArrowRightIcon,
    arrowLeft: ArrowLeftIcon,
    arrowUp: ArrowUpIcon,
    arrowDown: ArrowDownIcon,
    externalLink: ArrowTopRightOnSquareIcon,
    download: ArrowDownTrayIcon,
    refresh: ArrowPathIcon,
    
    // User & Auth
    user: UserIcon,
    userCircle: UserCircleIcon,
    userCheck: UserIcon,
    logout: ArrowRightOnRectangleIcon,
    login: ArrowLeftOnRectangleIcon,
    lock: LockClosedIcon,
    key: KeyIcon,
    eye: EyeIcon,
    eyeOff: EyeSlashIcon,
    eyeSlash: EyeSlashIcon,
    
    // Communication
    mail: EnvelopeIcon,
    chat: ChatBubbleLeftRightIcon,
    chatBubble: ChatBubbleLeftRightIcon,
    phone: PhoneIcon,
    send: PaperAirplaneIcon,
    paperAirplane: PaperAirplaneIcon,
    
    // Business & Finance
    chart: ChartBarIcon,
    dollar: CurrencyDollarIcon,
    money: BanknotesIcon,
    card: CreditCardIcon,
    arrowTrendingUp: ArrowTrendingUpIcon,
    arrowTrendingDown: ArrowTrendingDownIcon,
    
    // Security & Trust
    shield: ShieldCheckIcon,
    shieldWarning: ShieldExclamationIcon,
    warning: ExclamationTriangleIcon,
    success: CheckCircleIcon,
    error: XCircleIcon,
    
    // Technology & Devices
    mobile: DevicePhoneMobileIcon,
    desktop: ComputerDesktopIcon,
    tablet: DeviceTabletIcon,
    wifi: WifiIcon,
    server: ServerIcon,
    chip: CpuChipIcon,
    
    // Content & Media
    document: DocumentTextIcon,
    file: DocumentIcon,
    image: PhotoIcon,
    video: VideoCameraIcon,
    volume: SpeakerWaveIcon,
    mute: SpeakerXMarkIcon,
    
    // Actions & Tools
    search: MagnifyingGlassIcon,
    filter: FunnelIcon,
    settings: Cog6ToothIcon,
    tools: WrenchScrewdriverIcon,
    edit: PencilIcon,
    delete: TrashIcon,
    trash: TrashIcon,
    add: PlusIcon,
    remove: MinusIcon,
    
    // Status & Feedback
    info: InformationCircleIcon,
    alert: ExclamationCircleIcon,
    check: CheckIcon,
    time: ClockIcon,
    calendar: CalendarIcon,
    star: StarIcon,
    heart: HeartIcon,
    gift: GiftIcon,
    
    // Social & Community
    users: UsersIcon,
    team: UserGroupIcon,
    share: ShareIcon,
    link: LinkIcon,
    globe: GlobeAltIcon,
    
    // Miscellaneous
    home: HomeIcon,
    location: MapPinIcon,
    mapPin: MapPinIcon,
    building: BuildingOfficeIcon,
    store: BuildingStorefrontIcon,
    sparkles: SparklesIcon,
    trophy: TrophyIcon,
    bolt: BoltIcon,
    fire: FireIcon,
    sun: SunIcon,
    moon: MoonIcon,
    cloud: CloudIcon,
    cloudUpload: CloudArrowUpIcon,
    cloudDownload: CloudArrowDownIcon,
    database: CircleStackIcon,
    tag: TagIcon,
    bookmark: BookmarkIcon,
    flag: FlagIcon,
    bell: BellIcon,
    bellOff: BellSlashIcon,
    megaphone: MegaphoneIcon,
    mic: MicrophoneIcon,
    camera: CameraIcon,
    play: PlayIcon,
    pause: PauseIcon,
    stop: StopIcon,
    forward: ForwardIcon,
    backward: BackwardIcon,
    
  } as const
  
  // Icon component props
  export interface IconProps {
    name: keyof typeof Icons
    className?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  }

  // Import and re-export Icon component from TSX file
  export { Icon } from './Icon'
  
  // Export all individual icons for direct use if needed
  export {
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    UserIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    BoltIcon,
    GiftIcon,
    StarIcon,
    BuildingOfficeIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    SunIcon,
    MoonIcon,
    // Add other exports as needed
  }