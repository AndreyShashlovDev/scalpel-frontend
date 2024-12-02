import { DefaultTheme } from 'styled-components'

export class CommonLightTheme implements DefaultTheme {

  public readonly color = {
    common: {
      green: '#a6db57',
      red: '#db5757',
      orange: "#dbc957"
    },
    overlay: 'rgba(14,14,14,0.54)',
    background: '#ffffff',
    title: '#f6c92d',
    link: '#5496f1',
    text: {
      primary: '#000000',
      secondary: '#ada6a6'
    },
    button: {
      disabled: {
        text: {
          primary: '#ada6a6'
        },
        background: {
          primary: 'transparent'
        },
        border: {
          primary: '#ffffff'
        }
      },
      normal: {
        text: {
          primary: '#000000'
        },
        background: {
          primary: 'transparent'
        },
        border: {
          primary: '#ffffff'
        }
      }
    }
  }

  public readonly size = {
    header: '56px',

    fontSize: {
      xx_small: 'xx-small',
      x_small: 'x-small',
      smaller: 'smaller',
      small: 'small',
      medium: 'medium',
      larger: 'larger',
      large: 'large',
      x_large: 'x-large',
      xx_large: 'xx-large',
    },

    borderRadius: {
      smaller: '2px',
      small: '4px',
      medium: '8px',
      large: '16px',
    },

    button: {
      smaller: '20px',
      small: '24px',
      medium: '32px',
      large: '40px',
    },

    icon: {
      xx_small: '10px',
      x_small: '12px',
      smaller: '14px',
      small: '16px',
      medium: '24px',
      large: '32px',
      larger: '40px',
      x_large: '48px',
      xx_large: '56px',
    },

    dimens: {
      xx_small: '2px',
      x_small: '4px',
      smaller: '6px',
      small: '8px',
      medium: '12px',
      large: '16px',
      larger: '24px',
      x_large: '32px',
      xx_large: '48px',
    }
  }
}
