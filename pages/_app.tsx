import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';

import { AppProps, NextWebVitalsMetric } from 'next/app';
import { NavBar } from '../navigation/Navbar';

export function reportWebVitals(metric: NextWebVitalsMetric) {
    console.log(metric);
}

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <NavBar />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
