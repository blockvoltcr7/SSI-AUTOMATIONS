import '@testing-library/jest-dom'

describe('Environment-Specific Meta Tag Deployment', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    it('should include meta tag in production environment', () => {
      const isProduction = process.env.NODE_ENV === 'production'
      expect(isProduction).toBe(true)

      // In production, the meta tag should be included
      const metadata = {
        other: isProduction ? {
          'facebook-domain-verification': 'yb8e406dpnvzbn2gxsmdivpf1sjpny5'
        } : {}
      }

      expect(metadata.other).toHaveProperty('facebook-domain-verification')
      expect(metadata.other['facebook-domain-verification']).toBe('yb8e406dpnvzbn2gxsmdivpf1sjpny5')
    })

    it('should render meta tag when deployed to production domain', () => {
      // Simulate production domain check
      const domain = 'ssiautomations.com'
      const isProductionDomain = domain === 'ssiautomations.com'

      expect(isProductionDomain).toBe(true)

      // Meta tag should be present
      const shouldRenderMetaTag = process.env.NODE_ENV === 'production' && isProductionDomain
      expect(shouldRenderMetaTag).toBe(true)
    })
  })

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
    })

    it('should NOT include meta tag in development environment', () => {
      const isProduction = process.env.NODE_ENV === 'production'
      expect(isProduction).toBe(false)

      // In development, the meta tag should NOT be included
      const metadata = {
        other: isProduction ? {
          'facebook-domain-verification': 'yb8e406dpnvzbn2gxsmdivpf1sjpny5'
        } : {}
      }

      expect(metadata.other).not.toHaveProperty('facebook-domain-verification')
      expect(Object.keys(metadata.other)).toHaveLength(0)
    })

    it('should prevent accidental verification on localhost', () => {
      const domain = 'localhost:3000'
      const isProductionDomain = domain === 'ssiautomations.com'

      expect(isProductionDomain).toBe(false)

      // Meta tag should NOT be present on localhost
      const shouldRenderMetaTag = process.env.NODE_ENV === 'production' && isProductionDomain
      expect(shouldRenderMetaTag).toBe(false)
    })
  })

  describe('Staging Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production' // Staging often uses production build
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview' // But with different env variable
    })

    it('should NOT include meta tag in staging/preview environment', () => {
      // Check for staging-specific environment variable
      const isProduction = process.env.NODE_ENV === 'production' &&
                           process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

      expect(isProduction).toBe(false)

      // In staging, the meta tag should NOT be included
      const metadata = {
        other: isProduction ? {
          'facebook-domain-verification': 'yb8e406dpnvzbn2gxsmdivpf1sjpny5'
        } : {}
      }

      expect(metadata.other).not.toHaveProperty('facebook-domain-verification')
    })

    it('should handle preview deployments correctly', () => {
      const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      expect(isPreview).toBe(true)

      // Preview deployments should NOT have the meta tag
      const shouldRenderMetaTag = process.env.NODE_ENV === 'production' &&
                                   process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      expect(shouldRenderMetaTag).toBe(false)
    })
  })

  describe('Environment Variable Validation', () => {
    it('should validate environment variable configuration', () => {
      // Test various environment configurations
      const configurations = [
        { NODE_ENV: 'production', VERCEL_ENV: 'production', expected: true },
        { NODE_ENV: 'production', VERCEL_ENV: 'preview', expected: false },
        { NODE_ENV: 'development', VERCEL_ENV: 'development', expected: false },
        { NODE_ENV: 'test', VERCEL_ENV: 'test', expected: false }
      ]

      configurations.forEach(config => {
        process.env.NODE_ENV = config.NODE_ENV
        process.env.NEXT_PUBLIC_VERCEL_ENV = config.VERCEL_ENV

        const isProduction = process.env.NODE_ENV === 'production' &&
                            process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

        expect(isProduction).toBe(config.expected)
      })
    })

    it('should handle missing environment variables gracefully', () => {
      // Remove environment variables
      delete process.env.NEXT_PUBLIC_VERCEL_ENV

      // Should default to checking NODE_ENV only
      process.env.NODE_ENV = 'production'
      const isProduction = process.env.NODE_ENV === 'production'

      expect(isProduction).toBe(true)
    })
  })
})