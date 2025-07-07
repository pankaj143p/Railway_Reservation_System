/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_GATEWAY_URL: string
  readonly VITE_TRAIN_URL: string
  readonly VITE_RAZORPAY_KEY: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_REAL_TIME_TRACKING: string
  readonly VITE_ENABLE_PAYMENT_GATEWAY: string
  readonly VITE_ENABLE_SMS_NOTIFICATIONS: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_WEATHER_API_KEY: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_DEV_SERVER_PORT: string
  readonly VITE_DEV_SERVER_HOST: string
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
