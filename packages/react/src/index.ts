/**
 * @betterlibs/react — componentes accesibles para webs corporativas.
 *
 * Importa los estilos una vez en la raíz de tu app:
 *
 *   import '@betterlibs/tokens/index.css'
 *   import '@betterlibs/react/styles.css'
 */

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
  Container,
  type ContainerOwnProps,
  type ContainerProps,
} from './components/Container/Container'
export { Divider, type DividerProps } from './components/Divider/Divider'
export { Grid, type GridOwnProps, type GridProps } from './components/Grid/Grid'
export { Heading, type HeadingProps, type HeadingSize } from './components/Heading/Heading'
export { Icon, type IconProps } from './components/Icon/Icon'
export { IconButton, type IconButtonProps } from './components/IconButton/IconButton'
export { Image, type ImageProps } from './components/Image/Image'
export { Link, type LinkProps } from './components/Link/Link'
export { Section, type SectionOwnProps, type SectionProps } from './components/Section/Section'
export { Skeleton, type SkeletonProps } from './components/Skeleton/Skeleton'
export { SkipLink, type SkipLinkProps } from './components/SkipLink/SkipLink'
export { Spinner, type SpinnerProps } from './components/Spinner/Spinner'
export { Stack, type StackOwnProps, type StackProps } from './components/Stack/Stack'
export { Tag, type TagProps } from './components/Tag/Tag'
export { Text, type TextOwnProps, type TextProps } from './components/Text/Text'
export {
  VisuallyHidden,
  type VisuallyHiddenOwnProps,
  type VisuallyHiddenProps,
} from './components/VisuallyHidden/VisuallyHidden'

// Tipos compartidos
export type { Breakpoint, PolymorphicProps, Responsive, Space, Tone } from './utils/types'
