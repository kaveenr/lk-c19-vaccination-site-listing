import Head from 'next/head'
import {useTranslations, useIntl} from 'next-intl';
import {useRouter} from 'next/router';
import Link from 'next/link'
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';
import { AreaChart,BarChart, Bar, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { takeRight, last, startCase } from 'lodash';


const ChartComponent = ({vaxData}) => {

  const t = useTranslations('Graph');
  const intl = useIntl();

  const lastEntry = last(vaxData);
  const vaxPrgData = ["covishield", "sinopharm", "sputnik", "pfizer", "moderna"].map(vax => ({
    name: startCase(vax), 
    dose1: parseInt(lastEntry[`cum_${vax}_dose1`]),
    dose2: parseInt(lastEntry[`cum_${vax}_dose2`])
  }))

  return (
    <div className="flex flex-col items-stretch h-full ">
      <div className="w-full flex-grow text-center px-4 py-8">
        <p className="text-2xl mb-4">{t('totalDo')}</p>
        <ResponsiveContainer height="85%" width="100%">
          <AreaChart
          data={vaxData}

          margin={{
            top: 0,
            right: 50,
            left: 50,
            bottom: 0,
          }}
        >
          <XAxis dataKey="date" name="date" tickFormatter={(i) => (intl.formatDateTime(new Date(i),  { month: 'long', day: 'numeric'}))} />
          <YAxis type="number" domain={['auto', 'auto']} tickFormatter={(i) => (intl.formatNumber(i))} />
          <Tooltip />
          <Area name={t('cumDo1')} type="monotone" stackId="1" dataKey="cum_total_dose1" stroke="#ffc658" fill="#ffc658" />
          <Area name={t('cumDo2')} type="monotone" stackId="1" dataKey="cum_total_dose2" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full flex-grow text-center px-2 py-4 hidden md:block">
        <p className="text-2xl mb-4">{t('totalVa')}</p>
        <ResponsiveContainer height="85%" width="100%">
          <BarChart
              data={vaxPrgData}
              margin={{
                top: 0,
                right: 50,
                left: 50,
                bottom: 0,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis  tickFormatter={(i) => (i.toLocaleString("en-US"))}/>
              <Tooltip />
              <Legend />
              <Bar name={t('cumDo1')} dataKey="dose1" stackId="1" fill="#ffc658" />
              <Bar name={t('cumDo2')} dataKey="dose2" stackId="1" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    );
}

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
      <main className="grid gap-4 grid-cols-1 md:grid-cols-2 grid-row-1 md:h-2/3">
        <div className="bg-gray-50 h-full h-96 md:h-auto">
            <ChartComponent vaxData={props.vaxDataset}/>
        </div>
        <div className="md:overflow-y-auto md:overscroll-y-auto">
          {props.districtSlugs.map(a => (
              <Link href={`/${a}`}>
                <a>
                <div className={"bg-gray-50 px-6 py-4 mb-4"}>
                  <p className={"text-xl font-medium pb-2"}>{getLocalDistrict(a)}</p>
                  <p className={"text-gray-500"}>
                    <span className="font-medium">{t("count")}: </span> 
                    {getStationCount(a)}
                  </p>
                </div>
                </a>
              </Link>
          ))}
        </div>
      </main>
      <AppFooter/>
    </>
  )
}

export function getStaticProps({locale, district}) {
  const data = require("../data/latest.json");
  const vaxData = require("../data/vax-latest.json");
  return {
    props: {
      districtSlugs: data.districtSlugs,
      dataset: data.dataSet,
      vaxDataset: takeRight(vaxData, 30),
      messages: {
        ...require(`../lang/${locale}.json`),
      },
    }
  };
}