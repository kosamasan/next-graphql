import { useEffect } from 'react';
import React from 'react';
import CssBaseLine from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import { themeDark, themeLight } from 'lib/theme';

export default function MyApp({ Component, pageProps }) {

    useEffect(() => {
        // Remove server-side injected css
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);

    return (
        <ThemeProvider theme={false ? themeDark : themeLight}>
            <CssBaseLine />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
