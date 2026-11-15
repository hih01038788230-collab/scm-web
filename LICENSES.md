# Template attribution and licenses

## Official MUI Material UI Dashboard

- Free React template catalog: https://mui.com/material-ui/getting-started/templates/
- Dashboard source directory: https://github.com/mui/material-ui/tree/master/docs/data/material/getting-started/templates/dashboard
- Read source references: `Dashboard.tsx` composes `SideMenu`, `AppNavbar`, `Header`, and main content in a flex shell; `components/SideMenu.tsx` contains responsive navigation; `components/AppNavbar.tsx` supplies the responsive top bar. The upstream [`theme/customizations/index.ts`](https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/dashboard/theme/customizations/index.ts) exports Dashboard chart, data grid, date picker, and tree view customizations; it is distinct from the shared AppTheme configuration. Those MUI X features are not introduced in this foundation.
- This project follows those structural ideas with its own Korean navigation, route pages, and theme tokens. No Dashboard or component source file has been copied or modified from the template.
- The official free template catalog distinguishes the Dashboard from Premium templates. No MUI X Pro/Premium or paid template is used.
- MUI repository license: MIT, https://github.com/mui/material-ui/blob/master/LICENSE. Since no template code was copied, no template copyright header is reproduced here.

## Installed UI dependencies

Exact direct dependency versions are locked in package.json and package-lock.json. Material UI and its icons are published under MIT; Emotion under MIT; React Router under MIT. See package metadata and upstream license files for dependency notices; audit transitive notices when preparing a redistribution bundle.
