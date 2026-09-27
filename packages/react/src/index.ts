/**
 * @betterlibs/react — componentes accesibles para webs corporativas.
 *
 * Importa los estilos una vez en la raíz de tu app:
 *
 *   import '@betterlibs/tokens/index.css'
 *   import '@betterlibs/react/styles.css'
 */

export { BlogGrid, type BlogGridProps } from './blocks/Blog/BlogGrid'
export { formatPostDate, type Post, PostCard, type PostCardProps } from './blocks/Blog/PostCard'
export {
  CaseStudyCard,
  type CaseStudyCardProps,
  type CaseStudyMetric,
} from './blocks/CaseStudyCard/CaseStudyCard'
export {
  type ContactDetail,
  ContactSection,
  type ContactSectionProps,
} from './blocks/ContactSection/ContactSection'
export { ConsentGate, type ConsentGateProps } from './blocks/CookieConsent/ConsentGate'
export {
  type CookieCategory,
  CookieConsent,
  type CookieConsentProps,
  defaultCookieCategories,
} from './blocks/CookieConsent/CookieConsent'
export {
  type ConsentCategories,
  type ConsentConfig,
  cookieConsent,
  useCookieConsent,
} from './blocks/CookieConsent/store'
export { CTA, type CTAProps } from './blocks/CTA/CTA'
export { FAQ, type FAQProps, type FaqItem } from './blocks/FAQ/FAQ'
export { type Feature, FeatureGrid, type FeatureGridProps } from './blocks/FeatureGrid/FeatureGrid'
export { Hero, type HeroProps } from './blocks/Hero/Hero'
export { HeroVideo, type HeroVideoProps } from './blocks/Hero/HeroVideo'
export { LogoCloud, type LogoCloudProps, type LogoItem } from './blocks/LogoCloud/LogoCloud'
export { Newsletter, type NewsletterProps } from './blocks/Newsletter/Newsletter'
export {
  type BillingPeriod,
  type PerPeriod,
  Pricing,
  type PricingFeature,
  type PricingPlan,
  type PricingProps,
} from './blocks/Pricing/Pricing'
export { type StatItem, Stats, type StatsProps } from './blocks/Stats/Stats'
export type { BlockBaseProps } from './blocks/shared'
export { TeamGrid, type TeamGridProps, type TeamMember } from './blocks/TeamGrid/TeamGrid'
export {
  type Testimonial,
  TestimonialCard,
  type TestimonialCardProps,
  Testimonials,
  type TestimonialsProps,
} from './blocks/Testimonials/Testimonials'
export { Timeline, type TimelineItem, type TimelineProps } from './blocks/Timeline/Timeline'
export {
  Accordion,
  AccordionItem,
  type AccordionItemProps,
  type AccordionProps,
} from './components/Accordion/Accordion'
export { Alert, type AlertProps, type AlertTone } from './components/Alert/Alert'
export {
  AnnouncementBar,
  type AnnouncementBarProps,
} from './components/AnnouncementBar/AnnouncementBar'
export { AspectRatio, type AspectRatioProps } from './components/AspectRatio/AspectRatio'
export {
  Avatar,
  AvatarGroup,
  type AvatarGroupProps,
  type AvatarProps,
  type AvatarSize,
} from './components/Avatar/Avatar'
export { Badge, type BadgeProps } from './components/Badge/Badge'
export { Box, type BoxOwnProps, type BoxProps } from './components/Box/Box'
export {
  Breadcrumb,
  type BreadcrumbItem,
  type BreadcrumbProps,
} from './components/Breadcrumb/Breadcrumb'
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from './components/Button/Button'
export { ButtonGroup, type ButtonGroupProps } from './components/ButtonGroup/ButtonGroup'
export { Carousel, type CarouselProps } from './components/Carousel/Carousel'
export {
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxProps,
  type ChoiceVariant,
} from './components/Checkbox/Checkbox'
export {
  Container,
  type ContainerOwnProps,
  type ContainerProps,
} from './components/Container/Container'
export {
  Dialog,
  DialogClose,
  type DialogCloseProps,
  DialogContent,
  type DialogContentProps,
  type DialogProps,
  DialogTrigger,
  type DialogTriggerProps,
} from './components/Dialog/Dialog'
export { Divider, type DividerProps } from './components/Divider/Divider'
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  type DrawerContentProps,
  type DrawerProps,
  DrawerTrigger,
} from './components/Drawer/Drawer'
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  type DropdownMenuCheckboxItemProps,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  DropdownMenuGroup,
  DropdownMenuItem,
  type DropdownMenuItemProps,
  DropdownMenuLabel,
  type DropdownMenuProps,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  type DropdownMenuRadioItemProps,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
  DropdownMenuTrigger,
} from './components/DropdownMenu/DropdownMenu'
export {
  ErrorSummary,
  type ErrorSummaryItem,
  type ErrorSummaryProps,
} from './components/ErrorSummary/ErrorSummary'
export type { FieldIndicator } from './components/Field/context'
export { Field, type FieldProps } from './components/Field/Field'
export { type FieldControlOptions, useFieldControl } from './components/Field/use-field-control'
export { Fieldset, type FieldsetProps } from './components/Fieldset/Fieldset'
export { FileInput, type FileInputProps, formatFileSize } from './components/FileInput/FileInput'
export {
  Footer,
  type FooterColumn,
  type FooterLink,
  type FooterProps,
} from './components/Footer/Footer'
export { Form, type FormProps } from './components/Form/Form'
export {
  defaultValidationMessages,
  type FormErrors,
  type ValidationMessages,
} from './components/Form/validation'
export { Grid, type GridOwnProps, type GridProps } from './components/Grid/Grid'
export { Header, type HeaderProps } from './components/Header/Header'
export { Heading, type HeadingProps, type HeadingSize } from './components/Heading/Heading'
export { Icon, type IconProps } from './components/Icon/Icon'
export { IconButton, type IconButtonProps } from './components/IconButton/IconButton'
export { Image, type ImageProps } from './components/Image/Image'
export { Input, type InputProps } from './components/Input/Input'
export { Link, type LinkProps } from './components/Link/Link'
export { MobileNav, type MobileNavProps } from './components/NavigationMenu/MobileNav'
export {
  NavigationMenu,
  type NavigationMenuProps,
} from './components/NavigationMenu/NavigationMenu'
export type { NavGroup, NavItem, NavLink, NavSection } from './components/NavigationMenu/types'
export {
  Pagination,
  type PaginationProps,
  paginationRange,
} from './components/Pagination/Pagination'
export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  type PopoverContentProps,
  type PopoverProps,
  PopoverTrigger,
} from './components/Popover/Popover'
export {
  PortalProvider,
  type PortalProviderProps,
  usePortalContainer,
} from './components/Portal/Portal'
export { Prose, type ProseOwnProps, type ProseProps } from './components/Prose/Prose'
export {
  Radio,
  RadioGroup,
  type RadioGroupProps,
  type RadioProps,
} from './components/Radio/RadioGroup'
export { Section, type SectionOwnProps, type SectionProps } from './components/Section/Section'
export { SectionHeader, type SectionHeaderProps } from './components/SectionHeader/SectionHeader'
export {
  Select,
  type SelectOption,
  type SelectOptionGroup,
  type SelectProps,
} from './components/Select/Select'
export { Skeleton, type SkeletonProps } from './components/Skeleton/Skeleton'
export { SkipLink, type SkipLinkProps } from './components/SkipLink/SkipLink'
export {
  type SocialLink,
  SocialLinks,
  type SocialLinksProps,
  type SocialNetwork,
  socialNetworkLabels,
} from './components/SocialLinks/SocialLinks'
export { Spinner, type SpinnerProps } from './components/Spinner/Spinner'
export { Stack, type StackOwnProps, type StackProps } from './components/Stack/Stack'
export { Switch, type SwitchProps } from './components/Switch/Switch'
export {
  Tabs,
  TabsContent,
  TabsList,
  type TabsProps,
  TabsTrigger,
  type TabsTriggerProps,
} from './components/Tabs/Tabs'
export { Tag, type TagProps } from './components/Tag/Tag'
export { Text, type TextOwnProps, type TextProps } from './components/Text/Text'
export { Textarea, type TextareaProps } from './components/Textarea/Textarea'
export {
  type ToastAction,
  type ToastOptions,
  type ToastTone,
  toast,
} from './components/Toast/store'
export { Toaster, type ToasterPosition, type ToasterProps } from './components/Toast/Toaster'
export { Tooltip, type TooltipProps } from './components/Tooltip/Tooltip'
export {
  VisuallyHidden,
  type VisuallyHiddenOwnProps,
  type VisuallyHiddenProps,
} from './components/VisuallyHidden/VisuallyHidden'
// Tipos compartidos
export type { Breakpoint, PolymorphicProps, Responsive, Space, Tone } from './utils/types'
