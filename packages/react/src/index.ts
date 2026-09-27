/**
 * @betterlibs/react — componentes accesibles para webs corporativas.
 *
 * Importa los estilos una vez en la raíz de tu app:
 *
 *   import '@betterlibs/tokens/index.css'
 *   import '@betterlibs/react/styles.css'
 */

export { Alert, type AlertProps, type AlertTone } from './components/Alert/Alert'
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
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from './components/Button/Button'
export { ButtonGroup, type ButtonGroupProps } from './components/ButtonGroup/ButtonGroup'
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
export { Divider, type DividerProps } from './components/Divider/Divider'
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
export { Form, type FormProps } from './components/Form/Form'
export {
  defaultValidationMessages,
  type FormErrors,
  type ValidationMessages,
} from './components/Form/validation'
export { Grid, type GridOwnProps, type GridProps } from './components/Grid/Grid'
export { Heading, type HeadingProps, type HeadingSize } from './components/Heading/Heading'
export { Icon, type IconProps } from './components/Icon/Icon'
export { IconButton, type IconButtonProps } from './components/IconButton/IconButton'
export { Image, type ImageProps } from './components/Image/Image'
export { Input, type InputProps } from './components/Input/Input'
export { Link, type LinkProps } from './components/Link/Link'
export {
  Radio,
  RadioGroup,
  type RadioGroupProps,
  type RadioProps,
} from './components/Radio/RadioGroup'
export { Section, type SectionOwnProps, type SectionProps } from './components/Section/Section'
export {
  Select,
  type SelectOption,
  type SelectOptionGroup,
  type SelectProps,
} from './components/Select/Select'
export { Skeleton, type SkeletonProps } from './components/Skeleton/Skeleton'
export { SkipLink, type SkipLinkProps } from './components/SkipLink/SkipLink'
export { Spinner, type SpinnerProps } from './components/Spinner/Spinner'
export { Stack, type StackOwnProps, type StackProps } from './components/Stack/Stack'
export { Switch, type SwitchProps } from './components/Switch/Switch'
export { Tag, type TagProps } from './components/Tag/Tag'
export { Text, type TextOwnProps, type TextProps } from './components/Text/Text'
export { Textarea, type TextareaProps } from './components/Textarea/Textarea'
export {
  VisuallyHidden,
  type VisuallyHiddenOwnProps,
  type VisuallyHiddenProps,
} from './components/VisuallyHidden/VisuallyHidden'
// Tipos compartidos
export type { Breakpoint, PolymorphicProps, Responsive, Space, Tone } from './utils/types'
