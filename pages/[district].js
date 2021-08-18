import Head from 'next/head'
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';
import { AppHeader } from '../components/AppHeader';
import ReactMapGL, { Marker } from 'react-map-gl';
import { useState } from 'react';

const ItmRow = ({itm, lprefix}) => {
  const t = useTranslations('District');

  return (
    <div className={"bg-gray-50 px-4 py-4 mb-4"}>
      <p className={"text-xl font-medium pb-2"}>{itm[`center${lprefix}`]}</p>
      <p className={"text-gray-500"}>
        <span className="font-medium">{t("police")}: </span> 
        {itm[`police${lprefix}`]}
      </p>
      <p className={"text-gray-500"}>
        <span className="font-medium">{t("address")}: </span> 
        {itm[`formatted_address${lprefix}`]}
      </p>
      <div className="flex gap-2 pt-4">
        {itm.dose1 == "True" ? (
          <p className={"px-4 py-1 border-2 rounded-full border-gray-600"}>{t('dose1')}</p>
        ): []}
        {itm.dose2 == "True" ? (
          <p className={"px-4 py-1 border-2 rounded-full border-gray-600"}>{t('dose2')}</p>
        ): []}
      </div>
    </div>
  );
}

export default function District(props) {

  const t = useTranslations('District');

  const { locale } = useRouter();
  const lprefix = locale == "en" ? "": `_${locale}`

  const startPoint = props.items[0];
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: parseFloat(startPoint.lat),
    longitude: parseFloat(startPoint.lng),
    zoom: 10
  });
  

  return (
    <>
      <Head>
        <title>{t('title')} {startPoint[`district${lprefix}`]}</title>
      </Head>
      <AppHeader sub={t("sub", {district: startPoint[`district${lprefix}`]})}/>
      <main className="md:flex">
        {/* <div className={"p-4 bg-gray-50 flex-grow"}>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={"pk.eyJ1IjoidWtyaHEiLCJhIjoiY2tzZmp5ODRqMWIwcjJ1bjV6cHZmNHV3ZiJ9.xEVN9z2chyXqe03alU2O1Q"}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
        >
          {props.items.map(a => <Marker latitude={parseFloat(a.lat)} longitude={parseFloat(a.lng)}>
            <div>{a[`center${lprefix}`]}</div>
          </Marker>)}
        </ReactMapGL>
        </div> */}
        <div className="flex-grow">
          {props.items.map(itm => <ItmRow itm={itm} lprefix={lprefix} />)}
        </div>
      </main>
    </>
  )
}

export async function getStaticPaths() {

    const data = require("../data/latest.json");

    const allPages = ["si", "ta", "en"]
      .map(locale => data.districtSlugs.map(district=> {
        return { 
          locale: locale,
          params: {
            district: district
          }
        }
      })).flat();

    return {
      paths: allPages,
      fallback: false,
    }
}

export function getStaticProps({locale, params}) {

  const data = require("../data/latest.json");

  return {
    props: {
      district: params.district, 
      items: data.dataSet.filter(i => i.district === params.district),
      messages: {
        ...require(`../lang/${locale}.json`),
      },
    }
  };
}