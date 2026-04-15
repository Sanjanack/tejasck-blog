import React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { title?: string }

function BaseIcon({
  title,
  className,
  children,
  ...props
}: IconProps & { children?: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      className={['inline-block', className].filter(Boolean).join(' ')}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function IconDashboard(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 13h6V4H4v9z" />
      <path d="M14 20h6V11h-6v9z" />
      <path d="M14 4h6v5h-6V4z" />
      <path d="M4 20h6v-6H4v6z" />
    </BaseIcon>
  )
}

export function IconPosts(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h16" />
      <path d="M14 6v12" />
    </BaseIcon>
  )
}

export function IconComments(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1-5V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v8z" />
    </BaseIcon>
  )
}

export function IconMail(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M4 7l8 5 8-5" />
    </BaseIcon>
  )
}

export function IconInbox(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 4h16v16H4V4z" opacity="0" />
      <path d="M3 12h4l2 3h6l2-3h4" />
      <path d="M7 12V7h10v5" />
    </BaseIcon>
  )
}

export function IconVideo(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10l5-3v10l-5-3v-4z" />
    </BaseIcon>
  )
}

export function IconBook(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 19a2 2 0 0 0 2 2h14" />
      <path d="M4 5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 0-2 2V5z" />
    </BaseIcon>
  )
}

export function IconLogout(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
    </BaseIcon>
  )
}

export function IconHeart(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </BaseIcon>
  )
}

export function IconThumbsUp(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14 9V5a3 3 0 0 0-6 0v4" />
      <path d="M5 12h14l-1 9H6l-1-9z" />
    </BaseIcon>
  )
}

export function IconSmile(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </BaseIcon>
  )
}

export function IconSurprised(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 22s8-4 8-10a8 8 0 1 0-16 0c0 6 8 10 8 10z" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M8 15l2-2" />
      <path d="M16 15l-2-2" />
    </BaseIcon>
  )
}

export function IconSad(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 15s1.5-2 4-2 4 2 4 2" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </BaseIcon>
  )
}

export function IconAngry(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14 14l-2 2-2-2" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M8 13l-1.5 1.5" />
      <path d="M16 13l1.5 1.5" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </BaseIcon>
  )
}

export function IconGear(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V22h-4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2-3.5.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H2v-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.5.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V2h4v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 3.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1H22v4h-.2a1.7 1.7 0 0 0-1.6 1z" />
    </BaseIcon>
  )
}

export function IconRuler(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 21l18-18 2 2-18 18H3z" />
      <path d="M7 17l-2-2" />
      <path d="M10 14l-2-2" />
      <path d="M13 11l-2-2" />
      <path d="M16 8l-2-2" />
    </BaseIcon>
  )
}

export function IconGlobe(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
    </BaseIcon>
  )
}

export function IconPin(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </BaseIcon>
  )
}

export function IconDocument(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
      <path d="M8 9h4" />
    </BaseIcon>
  )
}

export function IconCode(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
      <path d="M14 4l-4 20" />
    </BaseIcon>
  )
}

export function IconSun(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </BaseIcon>
  )
}

export function IconMoon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </BaseIcon>
  )
}

