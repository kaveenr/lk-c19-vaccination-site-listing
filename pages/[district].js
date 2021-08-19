import Head from 'next/head'
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';
import { AppHeader } from '../components/AppHeader';
import ReactMapGL, { FlyToInterpolator, Marker } from 'react-map-gl';
import { useEffect, useRef, useState } from 'react';
import useSize from '@react-hook/size';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyringe } from '@fortawesome/free-solid-svg-icons'
import { truncate } from 'lodash';
import { AppFooter } from '../components/AppFooter';
import Link from 'next/link'
import WebMercatorViewport from "viewport-mercator-project"
import { getBounds } from '../util/mapUtils';
import { MPABOX_TOKEN } from '../util/constants';


const ItmRow = ({itm, lprefix, onHover}) => {
  const t = useTranslations('District');

  return (
    <Link href={`/${itm.district}/${itm.center}`} key={itm.center}>
      <a>
      <div className={"bg-gray-50 px-6 py-4 mb-4"} onMouseEnter={() => onHover(itm)}>
        <p className={"text-xl font-medium "}>{itm[`center${lprefix}`]}</p>
        <div className="flex gap-2 pb-2 pt-1">
          {itm.dose1 == "True" ? (
            <p className={"text-gray-600 text-sm px-2 italic border-2 rounded-full border-gray-600"}>{t('dose1')}</p>
          ): []}
          {itm.dose2 == "True" ? (
            <p className={"text-gray-600 text-sm px-2 italic border-2 rounded-full border-gray-600"}>{t('dose2')}</p>
          ): []}
        </div>
        <p className={"text-gray-500"}>
          <span className="font-medium">{t("police")}: </span> 
          {itm[`police${lprefix}`]}
        </p>
        <p className={"text-gray-500"}>
          <span className="font-medium">{t("address")}: </span> 
          {itm[`formatted_address${lprefix}`]}
        </p>
      </div>
      </a>
    </Link>
  );
}

export default function District(props) {

  const mapRef = useRef(null)
  const [ width, height ] = useSize(mapRef);
  const t = useTranslations('District');

  const { locale } = useRouter();
  const lprefix = locale == "en" ? "": `_${locale}`

  const startPoint = props.items[0];
  const [viewport, setViewport] = useState({
    width: width || 200,
    height: height || 200
  });

  useEffect(() => {
    if (width && height && props.items.length){
      const bounds = getBounds(props.items);
      setViewport((viewport) => {
        const nextViewport = new WebMercatorViewport({
          ...viewport,
          width,
          height
        }).fitBounds(bounds, {
           padding: 100
        });
        return nextViewport;
      })
    }
  }, [width, height]);

  const onHover = (itm) => {
    setViewport((viewport) => ({
      ...viewport,
      latitude: parseFloat(itm.lat),
      longitude: parseFloat(itm.lng),
      zoom: 15,
      transitionInterpolator: new FlyToInterpolator({speed: 1.2}),
      transitionDuration: 'auto'
  }));
  }
  
  return (
    <>
      <Head>
        <title>{t('title', {district: startPoint[`district${lprefix}`]})}</title>
      </Head>
      <AppHeader sub={t("sub", {district: startPoint[`district${lprefix}`]})}/>
      <main className="grid gap-4 grid-cols-1 md:grid-cols-2 grid-row-1 md:h-2/3">
        <div className={"bg-gray-50 hidden md:block h-full"}>
          <div ref={mapRef} className={"h-full"}>
            <ReactMapGL
              {...viewport}
              mapboxApiAccessToken={MPABOX_TOKEN}
              onViewportChange={nextViewport => setViewport(nextViewport)}
            >
              {props.items.map(a => <Marker latitude={parseFloat(a.lat)} longitude={parseFloat(a.lng)}>
                <Link href={`/${a.district}/${a.center}`} key={a.center}>
                <a className={"bg-yellow-50 bg-opacity-50 rounded-full h-24 w-24 flex flex-col items-center justify-center"}>
                  <div className="h-4 w-4">
                    <FontAwesomeIcon icon={faSyringe} color="red" />
                  </div>
                  <p className="text-xs font-medium text-center">{truncate(a[`center${lprefix}`], { length: 15})}</p>
                </a>
                </Link>
              </Marker>)}
          </ReactMapGL>
          </div>
        </div>
        <div className="md:overflow-y-auto md:overscroll-y-auto">
          {props.items.map(itm => <ItmRow onHover={onHover} itm={itm} lprefix={lprefix} />)}
        </div>
      </main>
      <AppFooter />
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