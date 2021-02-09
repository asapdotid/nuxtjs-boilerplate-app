# Nuxt JS Boilerplate Setup Application

Setup boilerplate application for development, staging and production with some modules:

> Using `Yarn` package manager

- PM2 global installation on host
- RimRaf
- Nuxt-Start for staging & production with PM2
- Runtime Config
- Tailwind CSS
- Style Resource (SASS)
- Web font loader (Google font)
- Sitemap
- Security
- Robots
- Font Awesome
- Image Optimizer (jpg, png, gif, svg & webp) 

> Note: All Modules install in `dependencies` not in `devDependencies`, due to deploy application with CI/CD & Docker

## Prepare application config files for Development, Staging & Production

- Development Environment `(.env.development)`

```bash
# MASTER CONFIG
# DEVELOPMENT ENVIRONMENT
APP_HOST=0.0.0.0
APP_PORT=3000
APP_MODE="Development"
APP_URL=http://localhost:3000
API_URL=https://api.development-domain.com:8080/v1/
```

- Staging Environment `(.env.staging)`

```bash
# MASTER CONFIG
# STAGING ENVIRONMENT
APP_HOST=0.0.0.0
APP_PORT=3000
APP_MODE="Development"
APP_URL=http://staging-domain.com:8080
API_URL=https://api.staging-domain.com:8080/v1/
```

- Production Environment `(.env.production)`

```bash
# MASTER CONFIG
# PRODUCTION ENVIRONMENT
APP_HOST=0.0.0.0
APP_PORT=3000
APP_MODE="Development"
APP_URL=http://production-domain.com
API_URL=https://api.production-domain.com/v1/
```

> You can custom all config value with your own config. And set up your key env to the Nuxt config and nuxt/vue files

How to use on Nuxt Config `(nuxt.config.js)`, like use dotenv module:

> process.env.APP_URL

```bash
...
  server: {
    port: process.env.APP_PORT,
    host: process.env.APP_HOST,
    timing: false,
  },
  
  publicRuntimeConfig: {
    appURL: process.env.APP_URL,
    apiURL: process.env.API_URL,
  },
```

How to use on part of _**Nuxt/Vue files**_ with **Public Runtime Config** or **Private Runtime Config** in `nuxt.config.js`

Sample in Pages/index.vue

```bash
<template>
  <div>
    <p>APP url: {{ appURL }} || API url: {{ $config.apiURL }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      appURL: this.$config.appURL
    }
  }
}
</script>
```

---

## Production Setup (Nuxt-Start + RimRaf + PM2)

- Documentation for Nuxt-Start [here](https://www.npmjs.com/package/nuxt-start)
- Documentation for RimRaf [here](https://www.npmjs.com/package/rimraf)
- Documentation for PM2 [here](https://pm2.keymetrics.io/)

Installation for Nuxt-Start:

```
using yarn:

yarn add nuxt-start
```

Installation for RimRaf:

```
using yarn:

yarn add rimraf
```

Installation for PM2 for Global installation:

```
using yarn:

yarn add pm2 -g
```

PM2 ecosystem config `ecosystem.config.js`:

```
module.exports = {
  apps: [
    {
      name: 'restaurant-staging-app',
      exec_mode: 'cluster',
      instances: 2,
      script: 'nuxt-start',
      args: '--dotenv .env.staging',
      watch: true,
      out_file: '/dev/null',
      error_file: '/dev/null',
      env: {
        HOST: '0.0.0.0',
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'restaurant-production-app',
      exec_mode: 'cluster',
      instances: 2,
      script: 'nuxt-start',
      args: '--dotenv .env.production',
      watch: true,
      out_file: '/dev/null',
      error_file: '/dev/null',
      env: {
        HOST: '0.0.0.0',
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
}
```

Finally modify `package.json` script:

```
...
"scripts": {
  "test": "jest",
  "clean": "rimraf .nuxt && rimraf dist",
  "dev": "nuxt --dotenv .env.development",
  "build:dev": "yarn clean && nuxt build --dotenv .env.development",
  "start:dev": "nuxt start --dotenv .env.development",
  "generate:dev": "nuxt generate --dotenv .env.development",
  "build:staging": "yarn clean && nuxt build --dotenv .env.staging",
  "start:staging": "pm2 start ecosystem.config.js --only nuxt-staging-app && pm2 logs",
  "reload:staging": "pm2 reload ecosystem.config.js --only nuxt-staging-app",
  "stop:staging": "pm2 stop ecosystem.config.js --only nuxt-staging-app",
  "delete:staging": "yarn stop:staging && pm2 delete ecosystem.config.js --only nuxt-staging-app",
  "build:production": "yarn clean && nuxt build --dotenv .env.production",
  "start:production": "pm2 start ecosystem.config.js --only nuxt-production-app && pm2 logs",
  "reload:production": "pm2 reload ecosystem.config.js --only nuxt-production-app",
  "stop:production": "pm2 stop ecosystem.config.js --only nuxt-production-app",
  "delete:production": "yarn stop:production && pm2 delete ecosystem.config.js --only nuxt-production-app"
},
```

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at development
$ yarn dev

# build for development and launch server LOCAL
$ yarn build:dev
$ yarn start:dev

# build for staging and launch server use PM2
$ yarn build:staging
$ yarn start:staging
$ yarn stop:staging
$ yarn reload:staging
$ yarn delete:staging

# build for production and launch server use PM2
$ yarn build:production
$ yarn start:production
$ yarn stop:production
$ yarn reload:production
$ yarn delete:production

# generate static project
$ yarn generate:dev
```

## Integrate with Tailwind CSS (Manual or Upgrade if install before):

```bash
# install Tailwind CSS
using yarn:

yarn add @nuxtjs/tailwindcss tailwindcss@npm:@tailwindcss/postcss7-compat @tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9

```

Custom Nuxt config on `nuxt.config.js`

```bash
// nuxt.config.js
export default {
  buildModules: ['@nuxtjs/tailwindcss']
}
```

Create your configuration file

Next, generate your tailwind.config.js file:

```bash
npx tailwindcss init
```

This will create a minimal `tailwind.config.js` file at the root of your project:

```bash
// tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

Configure Tailwind to remove unused styles in production

In your `tailwind.config.js` file, configure the `purge` option with the paths to all of your pages and components so Tailwind can tree-shake unused styles in production builds:

```bash
 // tailwind.config.js
  module.exports = {
-   purge: [],
+   purge: {
+     // enable remove unused CSS only in production
+     enabled: process.env.NODE_ENV === 'production',
+     // any file that contain the reference of CSS styles by the class
+     content: [
+       './components/**/*.{vue,js}',
+       './layouts/**/*.vue',
+       './pages/**/*.vue',
+       './plugins/**/*.{js,ts}',
+       './nuxt.config.{js,ts}',
+     ],
+   },
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }
```

## Using SASS global variables in Nuxt JS

Using a configuration file for global variables in Nuxt is very simple, it just takes some steps to follow

Step 1: Add sass-loader and node-sass to your project

```
using yarn:

yarn add node-sass sass-loader
```

Step 2: Adding the plugin style-resources to your project. If you don't know about plugins take a look in [NuxtJS documentation](https://nuxtjs.org/guide/plugins/). Also you can review the mentioned plugin [right here](https://github.com/nuxt-community/style-resources-module).

```
using yarn:

yarn add @nuxtjs/style-resources
```

Step 3: Adding to your assets directory a new sccs directory (this is where your global variable files will be stored, you can use as much as you like)

```
./assets/scss/vars/colors.scss
./assets/scss/abstracts/_mixins.scss
./assets/scss/global.scss
```

Step 4: Modify your `nuxt.config.js` file to map the new styles

```
modules: [
  '@nuxtjs/style-resources',
],

styleResources: {
    scss: [
    './assets/scss/vars/*.scss',
    './assets/scss/abstracts/_mixins.scss', // use underscore "_" & also file extension ".scss"
    './assets/scss/global.scss',
    ]
},
```

## Include Tailwind custom config with SCSS

Custom `nuxt.config.js` with tailwindcss config:

```
...
tailwindcss: {
    cssPath: '~/assets/scss/tailwind.scss',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {}
},
```

Open the `./assets/scss/tailwind.scss` file that Nuxt.js generates for you by default and use the `@tailwind` directive to include Tailwind's `base`, `components`, and `utilities` styles, replacing the original file contents:

```bash
/* purge css start ignore */
@tailwind base;
@tailwind components;
/* purge css and ignore */
@tailwind utilities;

*,
*:before,
*:after {
  @apply box-border m-0;
}

```

## Add Webfontloader Module

Documentation [here](https://www.npmjs.com/package/nuxt-webfontloader)

```
using yarn:

yarn add nuxt-webfontloader
```

And then add config webfontloader to `nuxt.config.js`:

```
export default {
  modules: [
    'nuxt-webfontloader',
  ],

  webfontloader: {
    google: {
      families: ['Lato:400,700'] //Loads Lato font with weights 400 and 700
    }
  },
}
```

## Add Sitemap Module

Documentation [here](https://sitemap.nuxtjs.org/)

```
using yarn:

yarn add @nuxtjs/sitemap
```

Setup config in `nuxt.config.js`:

```
export default {
  ...
  modules: [
    '@nuxtjs/sitemap'
  ]

  sitemap: {
    hostname: 'https://example.com',
    gzip: true,
  },
}
```

## Add Robots Module

Documentation [here](https://github.com/nuxt-community/robots-module)

```
using yarn:

yarn add @nuxtjs/robots
```

Setup config in `nuxt.config.js`:

```
export default {
  ...
  modules: [
    '@nuxtjs/robots'
  ]

  robots: {
    UserAgent: '*',
    Disallow: '/'
  },
}
```

## Add Nuxt Security

This module allows you to configure various security headers such as CSP, HSTS or even generate security.txt file. Here is a list of availables features :

- Strict-Transport-Security header
- Content-Security-Policy header
- X-Frame-Options header
- X-Xss-Protection
- X-Content-Type-Options header
- Referrer-Policy header
- Feature-Policy header

security.txt file generation

Documentation [here](https://github.com/dansmaculotte/nuxt-security)

```
using yarn:

yarn add @dansmaculotte/nuxt-security
```

Setup config in `nuxt.config.js`:

```
{
  modules: [
    // Simple usage
    '@dansmaculotte/nuxt-security'
  ],

  // Top level options
  security: {
    csp: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'self'"],
      },
      reportOnly: false,
    },
  },
}
```

## Add Nuxt Font Awesome

Module to use Font Awesome icons in your Nuxt.js project.

```
using yarn:

yarn add @nuxtjs/fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons
```

Setup config in `nuxt.config.js`:

```
  ...
  buildModules: [
    '@nuxtjs/fontawesome',
  ],
  
  // Fontawesome module configuration
  fontawesome: {
    component: 'fa',
    icons: {
      solid: ['faHome', 'faHeart'],
      
      // include all icons. But dont do this.
      // solid: true,
      // brands: true,
      // regular: true,
    },
```

use on html tag (for free):

- fas = solid icon (@fortawesome/free-solid-svg-icons)
- fab = brands icon (@fortawesome/free-brands-svg-icons)
- far = regular icon (@fortawesome/free-regular-svg-icons)
- fad = duotone icon (@fortawesome/free-duotone-svg-icons)
- fal = light icon (@fortawesome/free-light-svg-icons)

```
<fa :icon="['fas', 'home']" />
```

## Add Nuxt Optimized Images

Automatically optimizes images used in Nuxt.js projects (JPEG, PNG, SVG, WebP and GIF).

Documentation [here](https://github.com/juliomrqz/nuxt-optimized-images)

```
using yarn:

yarn add @aceforth/nuxt-optimized-images
```

Optimization Packages [here](https://marquez.co/docs/nuxt-optimized-images#optimization-packages)

```bash
using yarn:

yarn add imagemin-mozjpeg imagemin-pngquant imagemin-gifsicle imagemin-svgo  webp-loader lqip-loader responsive-loader sqip-loader sharp
```

Setup config in `nuxt.config.js`:

```
export default {
  ...
  buildModules: [
    '@aceforth/nuxt-optimized-images',
  ],

  optimizedImages: {
    optimizeImages: true
  }
}
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

---

Do not hesitate if there are suggestions and criticisms 😃 :) [@asapdotid](https://github.com/asapdotid)
