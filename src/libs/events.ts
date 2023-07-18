import { DetailedHTMLProps, HTMLAttributes } from 'react'

type Attrs = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export type CaptureEvents = {
  [Key in keyof Attrs as Key extends `on${string}Capture`
    ? Key
    : never]: ConfirmFunction<Key>
}

export type ConfirmFunction<Key extends keyof Attrs> = (
  ...params: Parameters<Attrs[Key]>
) => boolean | Promise<boolean>
