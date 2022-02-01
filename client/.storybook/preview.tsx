import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { StoryContext } from '@storybook/react'
import * as React from 'react'

/** Global Parameters */
export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

/** Custom Toolbars for Global Context */
export const globalTypes = {
  // i18n switching
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'ja',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'ja', right: 'jp', title: '日本語' },
        { value: 'en', right: '🇺🇸', title: 'English' }
      ]
    }
  }
}

/** Direction Mapping */
const directionMap = {
  ja: 'ltr',
  en: 'ltr'
}

/** Wrap with Chakra Provider */
const withChakra = (StoryFn: Function, context: StoryContext) => {
  const { locale } = context.globals
  const direction = directionMap[locale]
  return (
    <ChakraProvider theme={extendTheme({ locale, direction })}>
      <div dir={direction} id='story-wrapper' style={{ minHeight: '80vh' }}>
        <StoryFn />
      </div>
    </ChakraProvider>
  )
}

/** Decorators */
export const decorators = [withChakra]
