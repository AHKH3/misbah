import {
  Mail,
  Globe,
  MapPin,
  Video,
  Users,
  Briefcase,
  Clock,
  GraduationCap,
  Play,
  Upload,
  Check,
  Send,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  MessageCircle,
  LucideProps
} from 'lucide-react';

export type IconProps = LucideProps;

// Shared default props for the "Luxury/Quiet Depth" look
// Stroke width 1.5px gives a more premium, refined look than the default 2px
const DEFAULT_STROKE_WIDTH = 1.5;

export const Icons = {
  // Contact
  // Using MessageCircle for WhatsApp to maintain strict monochrome outline consistency
  WhatsApp: (props: LucideProps) => (
    <MessageCircle strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  // Using Send (Paper Plane) for Telegram
  Telegram: (props: LucideProps) => (
    <Send strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Email: (props: LucideProps) => (
    <Mail strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Website: (props: LucideProps) => (
    <Globe strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),

  // Profile Attributes
  Location: (props: LucideProps) => (
    <MapPin strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Online: (props: LucideProps) => (
    <Video strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  InPerson: (props: LucideProps) => (
    <Users strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Experience: (props: LucideProps) => (
    <Briefcase strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Time: (props: LucideProps) => (
    <Clock strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Qualification: (props: LucideProps) => (
    <GraduationCap strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Play: (props: LucideProps) => (
    <Play strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),

  // Actions / UI
  Upload: (props: LucideProps) => (
    <Upload strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Check: (props: LucideProps) => (
    <Check strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  ArrowRight: (props: LucideProps) => (
    <ChevronRight strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  ArrowLeft: (props: LucideProps) => (
    <ChevronLeft strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Menu: (props: LucideProps) => (
    <Menu strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  ),
  
  Close: (props: LucideProps) => (
    <X strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
  )
};