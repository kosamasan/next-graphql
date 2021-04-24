import { useEffect, useState } from 'react';
import React from 'react';
import CssBaseLine from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'lib/apollo';
import { themeDark, themeLight } from 'lib/theme';

export default function MyApp({ Component, pageProps }) {

    const apolloClient = useApollo(pageProps.initialApolloState);
    const [darkState, setDarkState] = useState(false);
    const handleThemeChange = () => {
        setDarkState(!darkState);
    }

    useEffect(() => {
        // Remove server-side injected css
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);

    return (
        <ApolloProvider client={apolloClient}>
            <ThemeProvider theme={darkState ? themeDark : themeLight}>
                <CssBaseLine />
                <Component {...pageProps} />
            </ThemeProvider>
        </ApolloProvider>
    );
}
