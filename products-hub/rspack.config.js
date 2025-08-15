import path from 'path';
import { fileURLToPath } from 'url';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { rspack } from '@rspack/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3107;

export default (env, argv) => {
  const isProduction = argv?.mode === 'production' || process.env.NODE_ENV === 'production';

  console.log('🔧 PRODUCTS-HUB RSPACK CONFIG - MODULE FEDERATION');
  console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`Port: ${PORT}`);

  return {
    entry: './src/index.tsx',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'eval-source-map',
    output: {
      publicPath: isProduction 
        ? 'https://products-hub.tesseract-hub.com/' 
        : `http://localhost:${PORT}/`,
      clean: true,
    },
    devServer: {
      port: PORT,
      historyApiFallback: true,
      allowedHosts: 'all',
      hot: true,
      liveReload: true,
      open: false,
      compress: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization, x-user-id, x-tenant-id"
      },
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
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
        title: 'Products Hub - Tesseract Hub'
      }),
      new ModuleFederationPlugin({
        name: 'productsHub',
        filename: 'remoteEntry.js',
        exposes: {
          './ProductsList': './src/components/lists/ProductsListWrapper',
          './ProductsForm': './src/components/forms/ProductsForm',
          './ProductDetails': './src/components/details/ProductDetails',
          './ProductsAnalytics': './src/components/stats/ProductsAnalyticsWrapper',
          './InventoryManagement': './src/components/inventory/InventoryManagement',
          './ProductsCategories': './src/components/categories/ProductsCategories',
        },
        dts: {
          generateTypes: false, // Disable DTS generation for now
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
          '@tanstack/react-query': {
            singleton: true,
            requiredVersion: '^5.62.8'
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
    ],
    optimization: {
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    },
    experiments: {
      css: true,
    },
  };
};