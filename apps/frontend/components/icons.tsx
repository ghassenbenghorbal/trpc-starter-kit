import { LightbulbIcon as LucideProps, Loader2, TypeIcon as type, type LucideIcon } from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  spinner: Loader2,
  microsoft: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23" {...props}>
      <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H12z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
  ),
}