import React from 'react'
import TransitionLink from 'gatsby-plugin-transition-link'
import { GatsbyLinkProps } from 'gatsby'
import { PAGE_TRANSITION_DURATION } from '../constants'

export function AnimatedLink<T>({ children, ...props }: GatsbyLinkProps<T>) {
  return (
    <TransitionLink
      {...props}
      exit={{ length: PAGE_TRANSITION_DURATION }}
      entry={{ delay: PAGE_TRANSITION_DURATION }}
    >
      {children}
    </TransitionLink>
  )
}
