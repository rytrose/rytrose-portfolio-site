import Layout from '../components/Layout';
import '../styles/globals.css';

import { Poppins, DM_Serif_Text } from 'next/font/google';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-poppins"
});

const dmSerifText = DM_Serif_Text({
  weight: '400',
  variable: "--font-dm-serif-text"
});

function MyApp({ Component, pageProps }) {
  return (
    <Layout className={`${poppins.variable} ${dmSerifText.variable}`}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp
