import path from 'path';
import { fileURLToPath } from 'url';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { rspack } from '@rspack/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3030;

export default (env, argv) => {
  const isProduction = argv?.mode === 'production' || process.env.NODE_ENV === 'production';

  console.log('🔧 COUPONS-HUB RSPACK CONFIG - MODULE FEDERATION');
  console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`Port: ${PORT}`);

  return {
    entry: './src/index.ts',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'eval-source-map',
    output: {
      publicPath: isProduction 
        ? 'https://coupons-hub.tesseract-hub.com/' 
        : `http://localhost:${PORT}/`,
      clean: true,
    },
    devServer: {
      port: PORT,
      historyApiFallback: true,
      allowedHosts: 'all',
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      }
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/services': path.resolve(__dirname, './src/services'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@workspace/shared': path.resolve(__dirname, '../../../../packages/shared/src/index.ts'),
        '@workspace/ui': path.resolve(__dirname, '../../../../packages/ui/src/index.ts')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
          exclude: /node_modules\/(?!@workspace)/,
        },
        {
          test: /\.css$/,
          type: 'javascript/auto',
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource'
        },
      ],
    },
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        title: 'Coupons Hub - Tesseract Hub'
      }),
      new ModuleFederationPlugin({
        name: 'couponsHub',
        filename: 'remoteEntry.js',
        dts: { generateTypes: false },
        exposes: {
          './CouponsHub': './src/App',
          './CouponsList': './src/components/lists/CouponsList',
          './CouponForm': './src/components/forms/CouponForm',
          './CouponDetails': './src/components/CouponDetails',
          './CouponFilters': './src/components/CouponsFilters',
          './CouponCampaignList': './src/components/lists/CouponCampaignList',
          './CouponManagementDashboard': './src/components/CouponManagementDashboard',
          './CouponStatistics': './src/components/CouponStatistics',
          './components': './src/components/index',
          './useCoupons': './src/hooks/useCoupons',
          './couponsApi': './src/services/couponsApi',
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: '^19.1.0'
          },
          'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: '^19.1.0'
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^7.6.3'
          },
          '@workspace/ui': {
            singleton: true,
            eager: true,
            requiredVersion: 'workspace:*',
            import: path.resolve(__dirname, '../../../../packages/ui/src/index.ts')
          },
          '@workspace/shared': {
            singleton: true,
            eager: true,
            requiredVersion: 'workspace:*',
            import: path.resolve(__dirname, '../../../../packages/shared/src/index.ts')
          }
        }
      })
    ]
  };
};