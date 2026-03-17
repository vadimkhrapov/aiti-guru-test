import type { ThemeConfig } from 'antd'

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2f3cff',
    colorLink: '#2f3cff',
    colorTextBase: '#171717',
    colorTextSecondary: '#8c8c8c',
    colorBorder: '#ebebeb',
    colorBgLayout: '#f6f6f7',
    colorBgContainer: '#ffffff',
    borderRadius: 12,
    borderRadiusLG: 20,
    controlHeight: 40,
    controlHeightLG: 44,
    fontSize: 14,
  },
  components: {
    Button: {
      borderRadius: 10,
      controlHeight: 40,
      fontWeight: 600,
      primaryShadow: 'none',
    },
    Card: {
      borderRadiusLG: 24,
    },
    Checkbox: {
      borderRadiusSM: 4,
    },
    Input: {
      borderRadius: 10,
      controlHeight: 40,
      activeShadow: 'none',
      hoverBorderColor: '#d9d9d9',
    },
    Table: {
      borderColor: '#f0f0f0',
      headerBg: '#ffffff',
      rowHoverBg: '#fafafa',
    },
  },
}
