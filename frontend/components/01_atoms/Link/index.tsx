import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import { default as NextLink, LinkProps as NextLinkProps } from 'next/link'
import React from 'react'
import { ContainerProps, ExcludeProperties } from 'types'

/** Link Props */
export type LinkProps = Omit<ChakraLinkProps, 'href'> & {
  /**
   * リンク先
   */
  href: NextLinkProps['href']
  /**
   * Next Link props - Chakra UI Linkのpropsとプロパティ名が重複する項目を除いたオブジェクト
   */
  nextLinkProps?: Omit<ExcludeProperties<NextLinkProps, ChakraLinkProps>, 'href' | 'passHref'>
}

/** Presenter Props */
export type PresenterProps = LinkProps

/** Presenter Component */
const LinkPresenter: React.VFC<PresenterProps> = ({ href, nextLinkProps, children, ...props }) => (
  <NextLink passHref href={href} {...nextLinkProps}>
    <ChakraLink {...props}>{children}</ChakraLink>
  </NextLink>
)

/** Container Component */
const LinkContainer: React.VFC<ContainerProps<LinkProps, PresenterProps>> = ({
  presenter,
  color = 'blue.400',
  ...props
}) => {
  return presenter({ color, ...props })
}

/** Link */
export default connect<LinkProps, PresenterProps>('Link', LinkPresenter, LinkContainer)
