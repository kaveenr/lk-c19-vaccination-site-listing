import Head from 'next/head'
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';
import Link from 'next/link'
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';

export default function Home(props) {

  const t = useTranslations('Index');
  const { locale } = useRouter();

  const getLocalDistrict = (slug) => {
    return props.dataset.find(a => a.district === slug)
      [locale == "en" ? "district": `district_${locale}`];
  }

  const getStationCount = (slug) => {
    return props.dataset.filter(a => a.district === slug).length;
  }

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader/>
      <main>
      {props.districtSlugs.map(a => (
        <Link href={`/${a}`}>
          <div className={"bg-gray-50 px-6 py-4 mb-4"}>
            <p className={"text-xl font-medium pb-2"}>{getLocalDistrict(a)}</p>
            <p className={"text-gray-500"}>
              <span className="font-medium">{t("count")}: </span> 
              {getStationCount(a)}
            </p>
          </div>
        </Link>
      ))}
      </main>
      <AppFooter/>
    </>
  )
}

export function getStaticProps({locale, district}) {
  const data = require("../data/latest.json");
  return {
    props: {
      districtSlugs: data.districtSlugs,
      dataset: data.dataSet,
      messages: {
        ...require(`../lang/${locale}.json`),
      },
    }
  };
}