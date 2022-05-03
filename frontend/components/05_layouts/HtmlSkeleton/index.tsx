import { Box, BoxProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import { APP_NAME, APP_URL } from 'const'
import Head from 'next/head'
import React, { Children } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { isNullish, isReactElement } from 'utils/impl/object'
import Title, { TitleProps } from './Title'

/** HtmlSkeleton Props */
export type HtmlSkeletonProps = WithChildren & BoxProps
/** Presenter Props */
type PresenterProps = HtmlSkeletonProps & { title?: TitleProps['children']; description: string }

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ title, description, children, ...props }) => (
  <Box {...props}>
    <Head>
      {/* タイトル */}
      <title>{title}</title>
      {/* favicon */}
      <link rel='icon' href='/favicon.ico' />
      {/* ブラウザテーマカラー */}
      <meta name='theme-color' content='#ffffff' />
      {/* サイト概要 */}
      <meta name='description' content={description} />
      {/* OGP 画像URL */}
      <meta property='og:image' content={APP_URL + '/ogp-image.png'} />
      {/* OGP タイトル */}
      <meta name='og:title' content={title} />
      {/* OGP サイト概要 */}
      <meta name='og:description' content={description} />
      {/* OGP Twitterカード */}
      <meta name='twitter:card' content='summary' />
      {/* apple ポータブル端末 アイコン */}
      <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
      {/* manifest.json */}
      <link rel='manifest' href='/manifest.json' />
    </Head>
    {children}
  </Box>
)

/** Container Component */
const Container: React.VFC<ContainerProps<HtmlSkeletonProps, PresenterProps>> = ({
  presenter,
  children,
  ...props
}) => {
  let title: TitleProps['children'] | undefined = undefined
  children = Children.map(children, (child) =>
    isReactElement(child) && child.type === Title
      ? (title = `${APP_NAME} - ${child.props.children}`) && undefined
      : child
  )
  if (isNullish(title)) title = APP_NAME
  const description = `${APP_NAME} is an application that allows you to casually chat with your friends!`
  return presenter({ title, description, children, ...props })
}

/** HtmlSkeleton */
export default connect<HtmlSkeletonProps, PresenterProps>('HtmlSkeleton', Presenter, Container)

// Sub Component
export type { TitleProps }
export { Title }
